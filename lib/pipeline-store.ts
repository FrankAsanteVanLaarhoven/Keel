import { randomBytes } from "node:crypto";
import { ensureRecords } from "./db";
import { sqlAll, sqlGet, sqlRun } from "./sql";
import {
  checkStatement,
  datasetNameOk,
  definitionOf,
  deliverGraph,
  labelOk,
  orderTransforms,
  ordersSample,
  parseDatasetFiles,
  PipelineError,
  runTransform,
  staleTransformIds,
  type BuildStep,
  type DatasetFile,
  type DatasetVersion,
  type OutputKind,
  type PipelineColumn,
  type RecordedRun,
  type TransformDef,
} from "./pipeline";

type BranchRow = { id: string; name: string; base_id: string | null };
type DatasetRow = {
  branch_id: string;
  name: string;
  version: number;
  files_json: string;
  columns_json: string;
  rows_json: string;
  content_hash: string;
};
type TransformRow = {
  id: string;
  name: string;
  inputs_json: string;
  statement: string;
  output_name: string;
  output_kind: string;
  object_type: string;
  grain: string;
};

export type PipelineView = {
  branch: string;
  branches: { name: string; base: string | null }[];
  datasets: {
    name: string;
    version: number;
    files: string[];
    columns: PipelineColumn[];
    rowCount: number;
    hash: string;
  }[];
  transforms: TransformDef[];
  objects: { name: string; grain: string; version: number; rowCount: number; hash: string }[];
  lineage: { id: string; name: string; stale: boolean; inputs: string[]; outputName: string; outputKind: OutputKind }[];
  build: null | {
    status: string;
    engine: string;
    at: number;
    steps: { transformId: string; name: string; status: string; rows?: number; error?: string }[];
    spark: string;
    flink: string;
  };
};

export async function pipelineView(ownerId: string, branchName = "main"): Promise<PipelineView> {
  await ensureRecords();
  const branch = await openBranch(ownerId, branchName);
  return viewOf(ownerId, branch);
}

export async function landDataset(ownerId: string, branchName: string, name: string, files: DatasetFile[]): Promise<PipelineView> {
  await ensureRecords();
  if (!datasetNameOk(name)) throw new PipelineError("name");
  const parsed = parseDatasetFiles(files);
  const branch = await openBranch(ownerId, branchName);
  const version = (await maxVersion(branch.id, name)) + 1;
  await sqlRun(
    `INSERT INTO keel_pipe_dataset (id, owner_id, branch_id, name, version, files_json, columns_json, rows_json, content_hash, build_id, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [id(), ownerId, branch.id, name, version, JSON.stringify(files), JSON.stringify(parsed.columns), JSON.stringify(parsed.rows), parsed.hash, null, Date.now()],
  );
  return viewOf(ownerId, branch);
}

export async function createPipelineBranch(ownerId: string, name: string, fromName: string): Promise<PipelineView> {
  await ensureRecords();
  if (!datasetNameOk(name) || name === "main") throw new PipelineError("name");
  const from = await openBranch(ownerId, fromName || "main");
  const existing = await sqlGet<{ id: string }>(`SELECT id FROM keel_pipe_branch WHERE owner_id = ? AND name = ?`, [ownerId, name]);
  if (existing) throw new PipelineError("name");
  const branchId = id();
  await sqlRun(
    `INSERT INTO keel_pipe_branch (id, owner_id, name, base_id, created_at) VALUES (?, ?, ?, ?, ?)`,
    [branchId, ownerId, name, from.id, Date.now()],
  );
  const transforms = await sqlAll<TransformRow>(`SELECT id, name, inputs_json, statement, output_name, output_kind, object_type, grain FROM keel_pipe_transform WHERE branch_id = ?`, [from.id]);
  for (const transform of transforms) {
    await sqlRun(
      `INSERT INTO keel_pipe_transform (id, owner_id, branch_id, name, inputs_json, statement, output_name, output_kind, object_type, grain, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [id(), ownerId, branchId, transform.name, transform.inputs_json, transform.statement, transform.output_name, transform.output_kind, transform.object_type, transform.grain, Date.now()],
    );
  }
  const created = await mustBranch(ownerId, name);
  return viewOf(ownerId, created);
}

export async function saveTransform(ownerId: string, branchName: string, draft: TransformDef): Promise<PipelineView> {
  await ensureRecords();
  if (!labelOk(draft.name) || !datasetNameOk(draft.outputName)) throw new PipelineError("name");
  if (draft.outputKind !== "dataset" && draft.outputKind !== "object") throw new PipelineError("output");
  if (draft.outputKind === "object" && (!datasetNameOk(draft.objectType) || !datasetNameOk(draft.grain))) throw new PipelineError("grain");
  if (!draft.inputs.length || draft.inputs.some((name) => !datasetNameOk(name))) throw new PipelineError("missing");
  const statement = checkStatement(draft.statement);
  const branch = await openBranch(ownerId, branchName);
  const current = await transformsOf(branch.id);
  const next = current.filter((item) => item.id !== draft.id);
  next.push({ ...draft, statement, objectType: draft.outputKind === "object" ? draft.objectType : "", grain: draft.outputKind === "object" ? draft.grain : "" });
  const datasets = await resolvedDatasets(ownerId, branch);
  orderTransforms(next, datasets.map((dataset) => dataset.name));
  const existing = draft.id ? await sqlGet<{ id: string }>(`SELECT id FROM keel_pipe_transform WHERE id = ? AND owner_id = ? AND branch_id = ?`, [draft.id, ownerId, branch.id]) : undefined;
  if (existing) {
    await sqlRun(
      `UPDATE keel_pipe_transform SET name = ?, inputs_json = ?, statement = ?, output_name = ?, output_kind = ?, object_type = ?, grain = ?, updated_at = ? WHERE id = ?`,
      [draft.name.trim(), JSON.stringify(draft.inputs), statement, draft.outputName, draft.outputKind, draft.outputKind === "object" ? draft.objectType : "", draft.outputKind === "object" ? draft.grain : "", Date.now(), draft.id],
    );
  } else {
    await sqlRun(
      `INSERT INTO keel_pipe_transform (id, owner_id, branch_id, name, inputs_json, statement, output_name, output_kind, object_type, grain, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [id(), ownerId, branch.id, draft.name.trim(), JSON.stringify(draft.inputs), statement, draft.outputName, draft.outputKind, draft.outputKind === "object" ? draft.objectType : "", draft.outputKind === "object" ? draft.grain : "", Date.now()],
    );
  }
  return viewOf(ownerId, branch);
}

export async function removeTransform(ownerId: string, branchName: string, transformId: string): Promise<PipelineView> {
  await ensureRecords();
  const branch = await openBranch(ownerId, branchName);
  await sqlRun(`DELETE FROM keel_pipe_run WHERE owner_id = ? AND transform_id = ?`, [ownerId, transformId]);
  await sqlRun(`DELETE FROM keel_pipe_transform WHERE id = ? AND owner_id = ? AND branch_id = ?`, [transformId, ownerId, branch.id]);
  return viewOf(ownerId, branch);
}

export async function previewTransform(ownerId: string, branchName: string, transformId: string): Promise<{ columns: PipelineColumn[]; rows: DatasetVersion["rows"] }> {
  await ensureRecords();
  const branch = await openBranch(ownerId, branchName);
  const transform = (await transformsOf(branch.id)).find((item) => item.id === transformId);
  if (!transform) throw new PipelineError("missing");
  const datasets = await resolvedDatasets(ownerId, branch);
  const inputs = transform.inputs.map((name) => {
    const dataset = datasets.find((item) => item.name === name);
    if (!dataset) throw new PipelineError("missing");
    return dataset;
  });
  return runTransform(inputs, transform.statement);
}

export async function deliverBranch(ownerId: string, branchName: string): Promise<PipelineView> {
  await ensureRecords();
  const branch = await openBranch(ownerId, branchName);
  const datasets = await resolvedDatasets(ownerId, branch);
  const transforms = await transformsOf(branch.id);
  const runs = await runsOf(branch.id);
  const result = deliverGraph({ datasets, transforms, runs });
  const buildId = id();
  for (const item of result.produced) {
    if (item.kind === "dataset") {
      const version = (await maxVersion(branch.id, item.name)) + 1;
      await sqlRun(
        `INSERT INTO keel_pipe_dataset (id, owner_id, branch_id, name, version, files_json, columns_json, rows_json, content_hash, build_id, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [id(), ownerId, branch.id, item.name, version, JSON.stringify(item.files), JSON.stringify(item.columns), JSON.stringify(item.rows), item.hash, buildId, Date.now()],
      );
    } else {
      const version = (await maxObjectVersion(branch.id, item.name)) + 1;
      await sqlRun(
        `INSERT INTO keel_pipe_object (id, owner_id, branch_id, name, grain, version, columns_json, rows_json, content_hash, build_id, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [id(), ownerId, branch.id, item.name, item.grain, version, JSON.stringify(item.columns), JSON.stringify(item.rows), item.hash, buildId, Date.now()],
      );
    }
    const transform = transforms.find((candidate) => candidate.id === item.transformId);
    if (!transform) continue;
    await sqlRun(
      `INSERT INTO keel_pipe_run (id, owner_id, branch_id, transform_id, input_hashes_json, output_hash, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [id(), ownerId, branch.id, item.transformId, JSON.stringify({ hashes: item.inputHashes, definition: definitionOf(transform) }), item.hash, Date.now()],
    );
  }
  await sqlRun(
    `INSERT INTO keel_pipe_build (id, owner_id, branch_id, status, engine, steps_json, spark_plan, flink_plan, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [buildId, ownerId, branch.id, result.status, "records", JSON.stringify(result.steps), result.spark, result.flink, Date.now()],
  );
  return viewOf(ownerId, branch);
}

export async function openOrdersSample(ownerId: string, branchName: string): Promise<PipelineView> {
  await ensureRecords();
  const sample = ordersSample();
  const branch = await openBranch(ownerId, branchName);
  for (const dataset of sample.datasets) {
    const taken = await sqlGet<{ id: string }>(`SELECT id FROM keel_pipe_dataset WHERE branch_id = ? AND name = ?`, [branch.id, dataset.name]);
    if (taken) throw new PipelineError("name");
    await landDataset(ownerId, branch.name, dataset.name, dataset.files);
  }
  const takenOutput = await sqlGet<{ id: string }>(`SELECT id FROM keel_pipe_transform WHERE branch_id = ? AND output_name = ?`, [branch.id, sample.transform.outputName]);
  if (!takenOutput) {
    await saveTransform(ownerId, branch.name, { ...sample.transform, id: "" });
  }
  return viewOf(ownerId, branch);
}

export async function pipelineExport(ownerId: string) {
  await ensureRecords();
  const branches = await sqlAll<BranchRow>(`SELECT id, name, base_id FROM keel_pipe_branch WHERE owner_id = ?`, [ownerId]);
  const datasets = await sqlAll(`SELECT branch_id, name, version, files_json, columns_json, content_hash, created_at FROM keel_pipe_dataset WHERE owner_id = ?`, [ownerId]);
  const transforms = await sqlAll(`SELECT branch_id, name, inputs_json, statement, output_name, output_kind, object_type, grain FROM keel_pipe_transform WHERE owner_id = ?`, [ownerId]);
  const objects = await sqlAll(`SELECT branch_id, name, grain, version, content_hash, created_at FROM keel_pipe_object WHERE owner_id = ?`, [ownerId]);
  return { branches, datasets, transforms, objects };
}

async function viewOf(ownerId: string, branch: BranchRow): Promise<PipelineView> {
  const branches = await sqlAll<BranchRow>(`SELECT id, name, base_id FROM keel_pipe_branch WHERE owner_id = ? ORDER BY name`, [ownerId]);
  const datasets = await resolvedDatasets(ownerId, branch);
  const transforms = await transformsOf(branch.id);
  const runs = await runsOf(branch.id);
  let lineage: PipelineView["lineage"] = [];
  try {
    const order = orderTransforms(transforms, datasets.map((dataset) => dataset.name));
    const hashes: Record<string, string> = {};
    for (const dataset of datasets) hashes[dataset.name] = dataset.hash;
    const stale = new Set(staleTransformIds(order, hashes, runs));
    lineage = order.map((transform) => ({
      id: transform.id,
      name: transform.name,
      stale: stale.has(transform.id),
      inputs: transform.inputs,
      outputName: transform.outputName,
      outputKind: transform.outputKind,
    }));
  } catch {
    lineage = transforms.map((transform) => ({
      id: transform.id,
      name: transform.name,
      stale: true,
      inputs: transform.inputs,
      outputName: transform.outputName,
      outputKind: transform.outputKind,
    }));
  }
  const objects = await sqlAll<{ name: string; grain: string; version: number; rows_json: string; content_hash: string }>(
    `SELECT name, grain, version, rows_json, content_hash FROM keel_pipe_object WHERE branch_id = ? ORDER BY name, version`,
    [branch.id],
  );
  const latestObjects = new Map<string, (typeof objects)[number]>();
  for (const object of objects) latestObjects.set(object.name, object);
  const build = await sqlGet<{ status: string; engine: string; steps_json: string; spark_plan: string; flink_plan: string; created_at: number }>(
    `SELECT status, engine, steps_json, spark_plan, flink_plan, created_at FROM keel_pipe_build WHERE branch_id = ? ORDER BY created_at DESC LIMIT 1`,
    [branch.id],
  );
  return {
    branch: branch.name,
    branches: branches.map((item) => ({ name: item.name, base: baseName(branches, item.base_id) })),
    datasets: datasets.map((dataset) => ({
      name: dataset.name,
      version: dataset.version,
      files: dataset.files.map((file) => file.name),
      columns: dataset.columns,
      rowCount: dataset.rows.length,
      hash: dataset.hash,
    })),
    transforms,
    objects: [...latestObjects.values()].map((object) => ({
      name: object.name,
      grain: object.grain,
      version: object.version,
      rowCount: arrayLength(object.rows_json),
      hash: object.content_hash,
    })),
    lineage,
    build: build
      ? {
          status: build.status,
          engine: build.engine,
          at: Number(build.created_at),
          steps: JSON.parse(build.steps_json) as BuildStep[],
          spark: build.spark_plan,
          flink: build.flink_plan,
        }
      : null,
  };
}

function baseName(branches: BranchRow[], baseId: string | null): string | null {
  if (!baseId) return null;
  return branches.find((item) => item.id === baseId)?.name ?? null;
}

async function openBranch(ownerId: string, name: string): Promise<BranchRow> {
  if (name !== "main" && !datasetNameOk(name)) throw new PipelineError("name");
  const found = await sqlGet<BranchRow>(`SELECT id, name, base_id FROM keel_pipe_branch WHERE owner_id = ? AND name = ?`, [ownerId, name || "main"]);
  if (found) return found;
  if (name && name !== "main") throw new PipelineError("missing");
  const branchId = id();
  await sqlRun(
    `INSERT INTO keel_pipe_branch (id, owner_id, name, base_id, created_at) VALUES (?, ?, 'main', NULL, ?)`,
    [branchId, ownerId, Date.now()],
  );
  return { id: branchId, name: "main", base_id: null };
}

async function mustBranch(ownerId: string, name: string): Promise<BranchRow> {
  const branch = await sqlGet<BranchRow>(`SELECT id, name, base_id FROM keel_pipe_branch WHERE owner_id = ? AND name = ?`, [ownerId, name]);
  if (!branch) throw new PipelineError("missing");
  return branch;
}

async function resolvedDatasets(ownerId: string, branch: BranchRow): Promise<DatasetVersion[]> {
  const names = new Set<string>();
  const seenBranches = new Set<string>();
  let current: BranchRow | undefined = branch;
  while (current && !seenBranches.has(current.id)) {
    seenBranches.add(current.id);
    const rows = await sqlAll<{ name: string }>(`SELECT DISTINCT name FROM keel_pipe_dataset WHERE owner_id = ? AND branch_id = ?`, [ownerId, current.id]);
    for (const row of rows) names.add(row.name);
    current = current.base_id
      ? await sqlGet<BranchRow>(`SELECT id, name, base_id FROM keel_pipe_branch WHERE id = ? AND owner_id = ?`, [current.base_id, ownerId])
      : undefined;
  }
  const datasets: DatasetVersion[] = [];
  for (const name of names) {
    const resolved = await resolveOne(ownerId, branch, name);
    if (resolved) datasets.push(resolved);
  }
  datasets.sort((a, b) => a.name.localeCompare(b.name));
  return datasets;
}

async function resolveOne(ownerId: string, branch: BranchRow, name: string): Promise<DatasetVersion | null> {
  const seen = new Set<string>();
  let current: BranchRow | undefined = branch;
  while (current && !seen.has(current.id)) {
    seen.add(current.id);
    const row = await sqlGet<DatasetRow>(
      `SELECT branch_id, name, version, files_json, columns_json, rows_json, content_hash FROM keel_pipe_dataset
       WHERE owner_id = ? AND branch_id = ? AND name = ? ORDER BY version DESC LIMIT 1`,
      [ownerId, current.id, name],
    );
    if (row) return toDataset(row);
    current = current.base_id
      ? await sqlGet<BranchRow>(`SELECT id, name, base_id FROM keel_pipe_branch WHERE id = ? AND owner_id = ?`, [current.base_id, ownerId])
      : undefined;
  }
  return null;
}

function toDataset(row: DatasetRow): DatasetVersion {
  return {
    name: row.name,
    version: Number(row.version),
    files: JSON.parse(row.files_json) as DatasetFile[],
    columns: JSON.parse(row.columns_json) as PipelineColumn[],
    rows: JSON.parse(row.rows_json) as DatasetVersion["rows"],
    hash: row.content_hash,
  };
}

async function transformsOf(branchId: string): Promise<TransformDef[]> {
  const rows = await sqlAll<TransformRow>(
    `SELECT id, name, inputs_json, statement, output_name, output_kind, object_type, grain FROM keel_pipe_transform WHERE branch_id = ? ORDER BY name`,
    [branchId],
  );
  return rows.map((row) => ({
    id: row.id,
    name: row.name,
    inputs: JSON.parse(row.inputs_json) as string[],
    statement: row.statement,
    outputName: row.output_name,
    outputKind: row.output_kind === "object" ? "object" : "dataset",
    objectType: row.object_type,
    grain: row.grain,
  }));
}

async function runsOf(branchId: string): Promise<RecordedRun[]> {
  const rows = await sqlAll<{ transform_id: string; input_hashes_json: string; created_at: number }>(
    `SELECT transform_id, input_hashes_json, created_at FROM keel_pipe_run WHERE branch_id = ? ORDER BY created_at`,
    [branchId],
  );
  const latest = new Map<string, RecordedRun>();
  for (const row of rows) {
    latest.set(row.transform_id, recordedRun(row.transform_id, row.input_hashes_json));
  }
  return [...latest.values()];
}

async function maxVersion(branchId: string, name: string): Promise<number> {
  const row = await sqlGet<{ version: number }>(`SELECT coalesce(max(version), 0) AS version FROM keel_pipe_dataset WHERE branch_id = ? AND name = ?`, [branchId, name]);
  return Number(row?.version ?? 0);
}

async function maxObjectVersion(branchId: string, name: string): Promise<number> {
  const row = await sqlGet<{ version: number }>(`SELECT coalesce(max(version), 0) AS version FROM keel_pipe_object WHERE branch_id = ? AND name = ?`, [branchId, name]);
  return Number(row?.version ?? 0);
}

function recordedRun(transformId: string, text: string): RecordedRun {
  const parsed = JSON.parse(text) as { hashes?: Record<string, string>; definition?: string };
  if (parsed && typeof parsed.hashes === "object") {
    return { transformId, inputHashes: parsed.hashes, definition: typeof parsed.definition === "string" ? parsed.definition : "" };
  }
  return { transformId, inputHashes: parsed as unknown as Record<string, string>, definition: "" };
}

function arrayLength(text: string): number {
  try {
    const value = JSON.parse(text) as unknown;
    return Array.isArray(value) ? value.length : 0;
  } catch {
    return 0;
  }
}

function id(): string {
  return randomBytes(12).toString("hex");
}
