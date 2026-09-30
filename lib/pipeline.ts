import { createHash } from "node:crypto";
import { DatabaseSync } from "node:sqlite";

export const pipelineRowCap = 2000;
export const pipelineFileCap = 8;
export const pipelineFileChars = 200_000;
export const recordsEngine = "records";

export type OutputKind = "dataset" | "object";
export type Cell = string | number | null;
export type PipelineRow = Record<string, Cell>;
export type PipelineColumn = { name: string; type: "text" | "number" };
export type DatasetFile = { name: string; text: string };

export type DatasetVersion = {
  name: string;
  version: number;
  files: DatasetFile[];
  columns: PipelineColumn[];
  rows: PipelineRow[];
  hash: string;
};

export type TransformDef = {
  id: string;
  name: string;
  inputs: string[];
  statement: string;
  outputName: string;
  outputKind: OutputKind;
  objectType: string;
  grain: string;
};

export type RecordedRun = {
  transformId: string;
  inputHashes: Record<string, string>;
  definition: string;
};

export type BuildStep = {
  transformId: string;
  name: string;
  status: "built" | "current" | "failed";
  rows?: number;
  error?: string;
};

export type ProducedOutput = {
  transformId: string;
  kind: OutputKind;
  name: string;
  grain: string;
  columns: PipelineColumn[];
  rows: PipelineRow[];
  files: DatasetFile[];
  hash: string;
  inputHashes: Record<string, string>;
};

export type PipelineErrorCode =
  | "name"
  | "file"
  | "columns"
  | "statement"
  | "cycle"
  | "missing"
  | "grain"
  | "output"
  | "rows"
  | "object-input"
  | "empty";

export class PipelineError extends Error {
  code: PipelineErrorCode;
  constructor(code: PipelineErrorCode) {
    super(code);
    this.code = code;
  }
}

export function datasetNameOk(name: string): boolean {
  return /^[a-z][a-z0-9_]{0,40}$/.test(name);
}

export function labelOk(name: string): boolean {
  const value = name.trim();
  return value.length > 0 && value.length <= 80 && !/[\u0000-\u001f]/.test(value);
}

export function hashFiles(files: DatasetFile[]): string {
  const stable = files.map((file) => ({ name: file.name, text: file.text.replace(/\r\n/g, "\n") }));
  return createHash("sha256").update(JSON.stringify(stable)).digest("hex");
}

export function parseDatasetFiles(files: DatasetFile[]): { columns: PipelineColumn[]; rows: PipelineRow[]; hash: string } {
  if (!files.length || files.length > pipelineFileCap) throw new PipelineError("file");
  let columns: PipelineColumn[] | null = null;
  const rows: PipelineRow[] = [];
  for (const file of files) {
    if (!file.name || file.name.includes("/") || file.name.includes("\\") || file.text.length > pipelineFileChars) {
      throw new PipelineError("file");
    }
    const parsed = file.name.toLowerCase().endsWith(".json") ? parseJson(file.text) : file.name.toLowerCase().endsWith(".csv") ? parseCsvFile(file.text) : null;
    if (!parsed) throw new PipelineError("file");
    if (!columns) columns = parsed.columns;
    else if (!sameColumns(columns, parsed.columns)) throw new PipelineError("columns");
    rows.push(...parsed.rows);
    if (rows.length > pipelineRowCap) throw new PipelineError("rows");
  }
  if (!columns || !rows.length) throw new PipelineError("file");
  return { columns, rows, hash: hashFiles(files) };
}

export function checkStatement(statement: string): string {
  const text = statement.trim().replace(/;+\s*$/, "");
  if (!text || text.length > 4000 || text.includes(";")) throw new PipelineError("statement");
  if (!/^(select|with)\b/i.test(text)) throw new PipelineError("statement");
  if (/\b(insert|update|delete|drop|alter|attach|detach|pragma|vacuum|reindex|create|replace|grant|copy|truncate|load_extension)\b/i.test(text)) {
    throw new PipelineError("statement");
  }
  return text;
}

export function orderTransforms(transforms: TransformDef[], datasetNames: string[]): TransformDef[] {
  const byOutput = new Map<string, TransformDef>();
  for (const transform of transforms) {
    if (!datasetNameOk(transform.outputName)) throw new PipelineError("name");
    if (byOutput.has(transform.outputName)) throw new PipelineError("output");
    byOutput.set(transform.outputName, transform);
  }
  const datasets = new Set(datasetNames);
  for (const name of byOutput.keys()) {
    if (datasets.has(name)) throw new PipelineError("output");
  }
  const visiting = new Set<string>();
  const visited = new Set<string>();
  const order: TransformDef[] = [];
  function walk(transform: TransformDef) {
    if (visited.has(transform.id)) return;
    if (visiting.has(transform.id)) throw new PipelineError("cycle");
    visiting.add(transform.id);
    for (const input of transform.inputs) {
      const producer = byOutput.get(input);
      if (producer?.outputKind === "object") throw new PipelineError("object-input");
      if (producer) walk(producer);
      else if (!datasets.has(input)) throw new PipelineError("missing");
    }
    visiting.delete(transform.id);
    visited.add(transform.id);
    order.push(transform);
  }
  for (const transform of transforms) walk(transform);
  return order;
}

export function definitionOf(transform: TransformDef): string {
  return hashFiles([{
    name: "definition",
    text: JSON.stringify({
      inputs: transform.inputs,
      statement: transform.statement,
      outputName: transform.outputName,
      outputKind: transform.outputKind,
      objectType: transform.objectType,
      grain: transform.grain,
    }),
  }]);
}

export function staleTransformIds(order: TransformDef[], hashes: Record<string, string>, runs: RecordedRun[]): string[] {
  const recorded = new Map(runs.map((run) => [run.transformId, run]));
  const producer = new Map<string, string>();
  for (const transform of order) {
    if (transform.outputKind === "dataset") producer.set(transform.outputName, transform.id);
  }
  const stale = new Set<string>();
  for (const transform of order) {
    const previous = recorded.get(transform.id);
    let dirty = !previous || previous.definition !== definitionOf(transform);
    for (const input of transform.inputs) {
      const madeBy = producer.get(input);
      if (madeBy && stale.has(madeBy)) dirty = true;
      if (!previous || previous.inputHashes[input] !== hashes[input]) dirty = true;
    }
    if (dirty) stale.add(transform.id);
  }
  return [...stale];
}

export function runTransform(datasets: DatasetVersion[], statement: string): { columns: PipelineColumn[]; rows: PipelineRow[] } {
  const text = checkStatement(statement);
  const db = new DatabaseSync(":memory:");
  try {
    for (const dataset of datasets) {
      if (!datasetNameOk(dataset.name)) throw new PipelineError("name");
      const cols = dataset.columns.map((column) => `${quoteIdent(column.name)} ${column.type === "number" ? "REAL" : "TEXT"}`);
      db.exec(`CREATE TABLE ${quoteIdent(dataset.name)} (${cols.join(", ")})`);
      const insert = db.prepare(
        `INSERT INTO ${quoteIdent(dataset.name)} (${dataset.columns.map((column) => quoteIdent(column.name)).join(", ")}) VALUES (${dataset.columns.map(() => "?").join(", ")})`,
      );
      for (const row of dataset.rows) {
        insert.run(...dataset.columns.map((column) => row[column.name] ?? null));
      }
    }
    const query = db.prepare(`SELECT * FROM (${text}) AS keel_out LIMIT ${pipelineRowCap + 1}`);
    const raw = query.all() as Record<string, Cell>[];
    if (raw.length > pipelineRowCap) throw new PipelineError("rows");
    const names = query.columns().map((column) => sanitizeColumn(String(column.name)));
    if (names.some((name) => !name) || new Set(names).size !== names.length) throw new PipelineError("columns");
    const columns = names.map((name, index) => ({
      name,
      type: raw.every((row) => typeof Object.values(row)[index] === "number" || Object.values(row)[index] == null) && raw.length ? "number" as const : "text" as const,
    }));
    const rows = raw.map((row) => {
      const values = Object.values(row);
      const next: PipelineRow = {};
      names.forEach((name, index) => {
        const value = values[index];
        next[name] = typeof value === "number" || typeof value === "string" ? value : value == null ? null : String(value);
      });
      return next;
    });
    return { columns, rows };
  } catch (error) {
    if (error instanceof PipelineError) throw error;
    const message = error instanceof Error ? error.message : "";
    if (/no such table/i.test(message)) throw new PipelineError("missing");
    throw new PipelineError("statement");
  } finally {
    db.close();
  }
}

export function rowsToCsv(columns: PipelineColumn[], rows: PipelineRow[]): string {
  const header = columns.map((column) => column.name).join(",");
  const body = rows.map((row) => columns.map((column) => csvCell(row[column.name] ?? null)).join(","));
  return [header, ...body].join("\n");
}

export function checkGrain(columns: PipelineColumn[], rows: PipelineRow[], grain: string): void {
  if (!datasetNameOk(grain) || !columns.some((column) => column.name === grain)) throw new PipelineError("grain");
  const seen = new Set<string>();
  for (const row of rows) {
    const value = row[grain];
    if (value == null || value === "") throw new PipelineError("grain");
    const key = String(value);
    if (seen.has(key)) throw new PipelineError("grain");
    seen.add(key);
  }
}

export function deliverGraph(input: {
  datasets: DatasetVersion[];
  transforms: TransformDef[];
  runs: RecordedRun[];
}): { status: "built" | "failed"; steps: BuildStep[]; produced: ProducedOutput[]; spark: string; flink: string } {
  const outputNames = new Set(input.transforms.map((transform) => transform.outputName));
  const sources = input.datasets.filter((dataset) => !outputNames.has(dataset.name));
  const order = orderTransforms(input.transforms, sources.map((dataset) => dataset.name));
  const hashes: Record<string, string> = {};
  const working = new Map<string, DatasetVersion>();
  for (const dataset of input.datasets) {
    hashes[dataset.name] = dataset.hash;
    working.set(dataset.name, dataset);
  }
  const stale = new Set(staleTransformIds(order, hashes, input.runs));
  const steps: BuildStep[] = [];
  const produced: ProducedOutput[] = [];
  let status: "built" | "failed" = "built";
  for (const transform of order) {
    if (!stale.has(transform.id)) {
      steps.push({ transformId: transform.id, name: transform.name, status: "current" });
      continue;
    }
    try {
      const inputs = transform.inputs.map((name) => {
        const dataset = working.get(name);
        if (!dataset) throw new PipelineError("missing");
        return dataset;
      });
      const result = runTransform(inputs, transform.statement);
      if (transform.outputKind === "object") checkGrain(result.columns, result.rows, transform.grain || transform.objectType);
      const files = [{ name: `${transform.outputName}.csv`, text: rowsToCsv(result.columns, result.rows) }];
      const hash = hashFiles(files);
      const inputHashes: Record<string, string> = {};
      for (const name of transform.inputs) inputHashes[name] = hashes[name] ?? "";
      produced.push({
        transformId: transform.id,
        kind: transform.outputKind,
        name: transform.outputKind === "object" ? transform.objectType : transform.outputName,
        grain: transform.outputKind === "object" ? transform.grain : "",
        columns: result.columns,
        rows: result.rows,
        files,
        hash,
        inputHashes,
      });
      if (transform.outputKind === "dataset") {
        const previous = working.get(transform.outputName);
        const next: DatasetVersion = {
          name: transform.outputName,
          version: (previous?.version ?? 0) + 1,
          files,
          columns: result.columns,
          rows: result.rows,
          hash,
        };
        working.set(transform.outputName, next);
        hashes[transform.outputName] = hash;
      }
      steps.push({ transformId: transform.id, name: transform.name, status: "built", rows: result.rows.length });
    } catch (error) {
      status = "failed";
      steps.push({
        transformId: transform.id,
        name: transform.name,
        status: "failed",
        error: error instanceof PipelineError ? error.code : "statement",
      });
      break;
    }
  }
  return {
    status,
    steps,
    produced,
    spark: compileSpark(order, input.datasets),
    flink: compileFlink(order, input.datasets),
  };
}

export function compileSpark(order: TransformDef[], datasets: DatasetVersion[]): string {
  const lines = ["-- Spark batch job", "-- The class records run this graph until a Spark worker is connected."];
  for (const dataset of datasets) {
    lines.push(
      `CREATE OR REPLACE TEMP VIEW ${dataset.name} USING csv OPTIONS (path 'dataset/${dataset.name}/v${dataset.version}', header 'true');`,
    );
  }
  for (const transform of order) {
    const target = transform.outputKind === "object" ? transform.objectType || transform.outputName : transform.outputName;
    lines.push(`-- ${transform.name} -> ${transform.outputKind} ${target}`);
    lines.push(`CREATE OR REPLACE TEMP VIEW ${transform.outputName} AS`);
    lines.push(checkStatement(transform.statement) + ";");
  }
  return lines.join("\n");
}

export function compileFlink(order: TransformDef[], datasets: DatasetVersion[]): string {
  const lines = [
    "-- Flink streaming job",
    "-- File sources are bounded. A stream connector replaces the filesystem block when a Flink worker is connected.",
  ];
  for (const dataset of datasets) {
    const fields = dataset.columns.map((column) => `  ${column.name} ${column.type === "number" ? "DOUBLE" : "STRING"}`).join(",\n");
    lines.push(`CREATE TEMPORARY TABLE ${dataset.name} (`);
    lines.push(fields);
    lines.push(") WITH (");
    lines.push("  'connector' = 'filesystem',");
    lines.push(`  'path' = 'dataset/${dataset.name}/v${dataset.version}',`);
    lines.push("  'format' = 'csv'");
    lines.push(");");
  }
  for (const transform of order) {
    lines.push(`-- ${transform.name}`);
    lines.push(`INSERT INTO ${transform.outputName}`);
    lines.push(checkStatement(transform.statement) + ";");
  }
  return lines.join("\n");
}

export function ordersSample(): { datasets: { name: string; files: DatasetFile[] }[]; transform: Omit<TransformDef, "id"> } {
  return {
    datasets: [
      {
        name: "orders",
        files: [{ name: "orders.csv", text: "order_id,status,amount\n1001,open,20\n1002,paid,15\n" }],
      },
      {
        name: "status",
        files: [{ name: "status.csv", text: "status,label\nopen,Open\npaid,Paid\n" }],
      },
    ],
    transform: {
      name: "Order status",
      inputs: ["orders", "status"],
      statement: "SELECT o.order_id, s.label AS status_label, o.amount FROM orders o JOIN status s ON o.status = s.status",
      outputName: "order_status",
      outputKind: "dataset",
      objectType: "",
      grain: "",
    },
  };
}

function sameColumns(left: PipelineColumn[], right: PipelineColumn[]): boolean {
  return left.length === right.length && left.every((column, index) => column.name === right[index]?.name);
}

function parseCsvFile(text: string): { columns: PipelineColumn[]; rows: PipelineRow[] } {
  const grid = parseCsv(text);
  if (grid.length < 2) throw new PipelineError("file");
  const names = grid[0].map(sanitizeColumn);
  if (names.some((name) => !name) || new Set(names).size !== names.length) throw new PipelineError("columns");
  const body = grid.slice(1).map((cells) => cells.map(cleanCell));
  return { columns: inferColumns(names, body), rows: toRows(names, body) };
}

function parseJson(text: string): { columns: PipelineColumn[]; rows: PipelineRow[] } {
  let value: unknown;
  try {
    value = JSON.parse(text);
  } catch {
    throw new PipelineError("file");
  }
  if (!Array.isArray(value) || !value.length) throw new PipelineError("file");
  const objects = value.filter((item) => item && typeof item === "object" && !Array.isArray(item)) as Record<string, unknown>[];
  if (objects.length !== value.length) throw new PipelineError("file");
  const names: string[] = [];
  for (const object of objects) {
    for (const key of Object.keys(object)) {
      const name = sanitizeColumn(key);
      if (name && !names.includes(name)) names.push(name);
    }
  }
  if (!names.length || new Set(names).size !== names.length) throw new PipelineError("columns");
  const body = objects.map((object) => names.map((name) => {
    const raw = object[name] ?? object[Object.keys(object).find((key) => sanitizeColumn(key) === name) ?? ""];
    if (typeof raw === "number" && Number.isFinite(raw)) return String(raw);
    if (raw == null) return "";
    if (typeof raw === "string") return raw;
    throw new PipelineError("file");
  }));
  return { columns: inferColumns(names, body), rows: toRows(names, body) };
}

function inferColumns(names: string[], body: string[][]): PipelineColumn[] {
  return names.map((name, index) => ({
    name,
    type: body.every((cells) => cells[index] === "" || /^-?\d+(\.\d+)?$/.test(cells[index] ?? "")) ? "number" : "text",
  }));
}

function toRows(names: string[], body: string[][]): PipelineRow[] {
  return body.map((cells) => {
    const row: PipelineRow = {};
    names.forEach((name, index) => {
      const value = cells[index] ?? "";
      row[name] = value === "" ? null : /^-?\d+(\.\d+)?$/.test(value) ? Number(value) : value;
    });
    return row;
  });
}

function cleanCell(value: string): string {
  return value.trim();
}

function sanitizeColumn(value: string): string {
  return value.trim().toLowerCase().replace(/[^a-z0-9_]+/g, "_").replace(/^_+|_+$/g, "").replace(/^(\d)/, "_$1");
}

function quoteIdent(name: string): string {
  if (!/^[a-z_][a-z0-9_]*$/.test(name)) throw new PipelineError("name");
  return `"${name}"`;
}

function csvCell(value: Cell): string {
  if (value == null) return "";
  const text = String(value);
  return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = "";
  let quoted = false;
  const source = text.replace(/^\uFEFF/, "");
  for (let index = 0; index < source.length; index += 1) {
    const char = source[index];
    if (quoted) {
      if (char === '"') {
        if (source[index + 1] === '"') {
          cell += '"';
          index += 1;
        } else quoted = false;
      } else cell += char;
    } else if (char === '"') quoted = true;
    else if (char === ",") {
      row.push(cell);
      cell = "";
    } else if (char === "\n" || char === "\r") {
      if (char === "\r" && source[index + 1] === "\n") index += 1;
      row.push(cell);
      cell = "";
      if (row.some((item) => item.trim() !== "")) rows.push(row);
      row = [];
    } else cell += char;
  }
  if (cell.length || row.length) {
    row.push(cell);
    if (row.some((item) => item.trim() !== "")) rows.push(row);
  }
  return rows;
}
