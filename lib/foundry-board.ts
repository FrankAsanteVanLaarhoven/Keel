export type WireStyle = "curve" | "elbow" | "straight";

export type UmlFamily = "class" | "usecase" | "sequence" | "activity" | "component" | "deploy" | "state" | "object" | "package" | "timing" | "overview" | "infoflow" | "profile" | "erd" | "ai" | "flowchart" | "mindmap" | "c4" | "sysml" | "bpmn" | "dataflow" | "wireframe" | "aws" | "gcp" | "azure";

export type UmlGlyph =
  | "class"
  | "iface"
  | "enum"
  | "data"
  | "package"
  | "actor"
  | "case"
  | "bound"
  | "life"
  | "frag"
  | "action"
  | "decide"
  | "start"
  | "stop"
  | "end"
  | "fork"
  | "object"
  | "lane"
  | "comp"
  | "port"
  | "art"
  | "node"
  | "device"
  | "exec"
  | "state"
  | "choice"
  | "hist"
  | "model"
  | "frame"
  | "ball"
  | "socket"
  | "entity"
  | "weak"
  | "junction"
  | "attr"
  | "rel"
  | "prompt"
  | "modelcard"
  | "dataset"
  | "embed"
  | "retriever"
  | "agent"
  | "tool"
  | "guard"
  | "eval"
  | "serving";

export type UmlNodeType =
  | "uml-class"
  | "uml-iface"
  | "uml-enum"
  | "uml-data"
  | "uml-pkg"
  | "uml-actor"
  | "uml-case"
  | "uml-bound"
  | "uml-life"
  | "uml-frag"
  | "uml-action"
  | "uml-decide"
  | "uml-start"
  | "uml-stop"
  | "uml-end"
  | "uml-fork"
  | "uml-object"
  | "uml-lane"
  | "uml-comp"
  | "uml-port"
  | "uml-art"
  | "uml-node"
  | "uml-device"
  | "uml-exec"
  | "uml-state"
  | "uml-choice"
  | "uml-hist"
  | "uml-model"
  | "uml-frame"
  | "uml-ball"
  | "uml-socket"
  | "uml-dur"
  | "uml-tick"
  | "uml-iuse"
  | "uml-iitem"
  | "uml-profile"
  | "uml-stereo"
  | "uml-meta"
  | "erd-entity"
  | "erd-weak"
  | "erd-assoc"
  | "erd-attr"
  | "erd-rel"
  | "ai-prompt"
  | "ai-model"
  | "ai-data"
  | "ai-embed"
  | "ai-retr"
  | "ai-agent"
  | "ai-tool"
  | "ai-guard"
  | "ai-eval"
  | "ai-serve"
  | "flow-start"
  | "flow-proc"
  | "flow-decide"
  | "flow-io"
  | "flow-doc"
  | "flow-end"
  | "mind-topic"
  | "mind-idea"
  | "c4-person"
  | "c4-system"
  | "c4-box"
  | "c4-comp"
  | "c4-ext"
  | "sys-block"
  | "sys-req"
  | "sys-cons"
  | "sys-port"
  | "sys-value"
  | "bpmn-start"
  | "bpmn-task"
  | "bpmn-gate"
  | "bpmn-end"
  | "bpmn-sub"
  | "wf-screen"
  | "wf-nav"
  | "wf-button"
  | "wf-field"
  | "wf-image"
  | "wf-head"
  | "wf-list"
  | "aws-ec2"
  | "aws-lambda"
  | "aws-s3"
  | "aws-rds"
  | "aws-vpc"
  | "aws-elb"
  | "aws-api"
  | "aws-cf"
  | "aws-sqs"
  | "aws-iam"
  | "gcp-gce"
  | "gcp-run"
  | "gcp-func"
  | "gcp-gcs"
  | "gcp-sql"
  | "gcp-vpc"
  | "gcp-lb"
  | "gcp-pub"
  | "gcp-iam"
  | "gcp-cdn"
  | "az-vm"
  | "az-func"
  | "az-blob"
  | "az-sql"
  | "az-vnet"
  | "az-lb"
  | "az-apim"
  | "az-queue"
  | "az-ad"
  | "az-cdn";

export type UmlRelation =
  | "association"
  | "directed"
  | "aggregation"
  | "composition"
  | "generalization"
  | "realization"
  | "dependency"
  | "include"
  | "extend"
  | "message"
  | "return"
  | "create"
  | "destroy"
  | "transition"
  | "objectflow"
  | "assembly"
  | "communicate"
  | "deploy"
  | "containment"
  | "import"
  | "merge"
  | "crows"
  | "identify"
  | "nonident"
  | "reads"
  | "calls"
  | "grounds"
  | "guards"
  | "trains"
  | "serves"
  | "flow"
  | "branch"
  | "c4link"
  | "satisfy"
  | "trace"
  | "allocate"
  | "itemflow"
  | "sequence"
  | "messageflow"
  | "clink"
  | "timecons"
  | "extension";

export type UmlMarkerEnd = "none" | "open" | "arrow" | "triangle" | "ball";
export type UmlMarkerStart = "none" | "diamond" | "diamond-filled" | "plus";

export interface UmlTool {
  type: UmlNodeType;
  name: string;
  families: readonly UmlFamily[];
  w: number;
  h: number;
  glyph: UmlGlyph;
  stereotype?: string;
}

export interface UmlRelationSpec {
  id: UmlRelation;
  name: string;
  families: readonly UmlFamily[];
  dashed: boolean;
  end: UmlMarkerEnd;
  start: UmlMarkerStart;
  label: string;
}

export const UML_FAMILIES: readonly { id: UmlFamily; name: string }[] = [
  { id: "class", name: "Class" },
  { id: "usecase", name: "Use case" },
  { id: "sequence", name: "Sequence" },
  { id: "activity", name: "Activity" },
  { id: "component", name: "Component" },
  { id: "deploy", name: "Deployment" },
  { id: "state", name: "State machine" },
  { id: "object", name: "Object" },
  { id: "package", name: "Package" },
  { id: "timing", name: "Timing" },
  { id: "overview", name: "Interaction overview" },
  { id: "infoflow", name: "Information flow" },
  { id: "profile", name: "Profile" },
  { id: "erd", name: "Entity-relationship" },
  { id: "ai", name: "AI design" },
  { id: "flowchart", name: "Flowchart" },
  { id: "mindmap", name: "Mind map" },
  { id: "c4", name: "C4" },
  { id: "sysml", name: "SysML" },
  { id: "bpmn", name: "BPMN" },
  { id: "dataflow", name: "Dataflow" },
  { id: "wireframe", name: "Wireframe" },
  { id: "aws", name: "AWS" },
  { id: "gcp", name: "GCP" },
  { id: "azure", name: "Azure" },
];

export type ModelLanguage = "uml" | "erd" | "dataflow" | "flowchart" | "mindmap" | "c4" | "sysml" | "bpmn" | "wireframe" | "aws" | "gcp" | "azure" | "ai";

export const MODEL_LANGUAGES: readonly { id: ModelLanguage; name: string }[] = [
  { id: "uml", name: "UML 2" },
  { id: "erd", name: "ERD" },
  { id: "dataflow", name: "Dataflow" },
  { id: "flowchart", name: "Flowchart" },
  { id: "mindmap", name: "Mind map" },
  { id: "c4", name: "C4" },
  { id: "sysml", name: "SysML" },
  { id: "bpmn", name: "BPMN" },
  { id: "wireframe", name: "Wireframe" },
  { id: "aws", name: "AWS" },
  { id: "gcp", name: "GCP" },
  { id: "azure", name: "Azure" },
  { id: "ai", name: "AI design" },
];

const OWN_LANGUAGE = new Set<string>(["erd", "dataflow", "flowchart", "mindmap", "c4", "sysml", "bpmn", "wireframe", "aws", "gcp", "azure", "ai"]);

export function languageOf(family: string): ModelLanguage {
  if (OWN_LANGUAGE.has(family)) return family as ModelLanguage;
  return "uml";
}

export function diagramsFor(language: string): readonly { id: UmlFamily; name: string }[] {
  if (language === "uml") return UML_FAMILIES.filter((item) => languageOf(item.id) === "uml");
  return UML_FAMILIES.filter((item) => item.id === language);
}

export function defaultFamily(language: string): UmlFamily {
  const match = UML_FAMILIES.find((item) => item.id === language);
  return match ? match.id : "class";
}

export function familyOf(value: unknown): UmlFamily {
  if (typeof value === "string" && UML_FAMILIES.some((item) => item.id === value)) return value as UmlFamily;
  return "class";
}

export function languageLabel(family: string): string {
  const language = languageOf(family);
  const name = MODEL_LANGUAGES.find((item) => item.id === language)?.name ?? "UML 2";
  if (language !== "uml") return name;
  const diagram = UML_FAMILIES.find((item) => item.id === family)?.name ?? "Class";
  return `${name} · ${diagram}`;
}

export interface StoredSheet {
  id: string;
  name: string;
  family: UmlFamily;
  nodes: unknown[];
  connections: unknown[];
}

export function readStoredProject(file: unknown): { sheetId: string; sheets: StoredSheet[] } | null {
  if (!file || typeof file !== "object") return null;
  const raw = file as { sheets?: unknown; sheetId?: unknown; nodes?: unknown; connections?: unknown };
  if (Array.isArray(raw.sheets)) {
    const sheets: StoredSheet[] = [];
    const used = new Set<string>();
    for (const item of raw.sheets) {
      if (!item || typeof item !== "object") continue;
      const sheet = item as { id?: unknown; name?: unknown; family?: unknown; nodes?: unknown; connections?: unknown };
      let id = typeof sheet.id === "string" && sheet.id.trim() ? sheet.id.trim().slice(0, 80) : `diagram-${sheets.length + 1}`;
      while (used.has(id)) id = `${id}-${sheets.length + 1}`;
      used.add(id);
      sheets.push({
        id,
        name: typeof sheet.name === "string" && sheet.name.trim() ? sheet.name.trim().slice(0, 80) : `Diagram ${sheets.length + 1}`,
        family: familyOf(sheet.family),
        nodes: Array.isArray(sheet.nodes) ? sheet.nodes : [],
        connections: Array.isArray(sheet.connections) ? sheet.connections : [],
      });
    }
    if (sheets.length === 0) return null;
    const sheetId = typeof raw.sheetId === "string" && sheets.some((sheet) => sheet.id === raw.sheetId) ? raw.sheetId : sheets[0].id;
    return { sheetId, sheets };
  }
  if (!Array.isArray(raw.nodes)) return null;
  return {
    sheetId: "diagram-1",
    sheets: [{
      id: "diagram-1",
      name: "Diagram 1",
      family: "class",
      nodes: raw.nodes,
      connections: Array.isArray(raw.connections) ? raw.connections : [],
    }],
  };
}

const UML_TOOL_BY_TYPE: Record<UmlNodeType, UmlTool> = {
  "uml-class": { type: "uml-class", name: "Class", families: ["class", "infoflow"], w: 200, h: 132, glyph: "class" },
  "uml-iface": { type: "uml-iface", name: "Interface", families: ["class", "component"], w: 200, h: 120, glyph: "iface", stereotype: "interface" },
  "uml-enum": { type: "uml-enum", name: "Enumeration", families: ["class"], w: 180, h: 120, glyph: "enum", stereotype: "enumeration" },
  "uml-data": { type: "uml-data", name: "Data type", families: ["class"], w: 180, h: 96, glyph: "data", stereotype: "dataType" },
  "uml-pkg": { type: "uml-pkg", name: "Package", families: ["class", "package"], w: 200, h: 140, glyph: "package" },
  "uml-actor": { type: "uml-actor", name: "Actor", families: ["usecase", "sequence", "infoflow"], w: 96, h: 132, glyph: "actor" },
  "uml-case": { type: "uml-case", name: "Use case", families: ["usecase"], w: 168, h: 72, glyph: "case" },
  "uml-bound": { type: "uml-bound", name: "Boundary", families: ["usecase"], w: 420, h: 260, glyph: "bound" },
  "uml-life": { type: "uml-life", name: "Lifeline", families: ["sequence", "timing"], w: 140, h: 300, glyph: "life" },
  "uml-frag": { type: "uml-frag", name: "Fragment", families: ["sequence"], w: 240, h: 140, glyph: "frag", stereotype: "alt" },
  "uml-action": { type: "uml-action", name: "Action", families: ["activity", "overview"], w: 168, h: 56, glyph: "action" },
  "uml-decide": { type: "uml-decide", name: "Decision", families: ["activity", "overview"], w: 110, h: 88, glyph: "decide" },
  "uml-start": { type: "uml-start", name: "Initial", families: ["activity", "state", "overview"], w: 72, h: 72, glyph: "start" },
  "uml-stop": { type: "uml-stop", name: "Final", families: ["activity", "state", "overview"], w: 72, h: 72, glyph: "stop" },
  "uml-end": { type: "uml-end", name: "Flow final", families: ["activity"], w: 72, h: 72, glyph: "end" },
  "uml-fork": { type: "uml-fork", name: "Fork", families: ["activity", "state", "overview"], w: 150, h: 56, glyph: "fork" },
  "uml-object": { type: "uml-object", name: "Object", families: ["activity", "object"], w: 180, h: 96, glyph: "object" },
  "uml-lane": { type: "uml-lane", name: "Swimlane", families: ["activity"], w: 220, h: 320, glyph: "lane" },
  "uml-comp": { type: "uml-comp", name: "Component", families: ["component", "deploy"], w: 190, h: 110, glyph: "comp" },
  "uml-port": { type: "uml-port", name: "Port", families: ["component"], w: 64, h: 64, glyph: "port" },
  "uml-art": { type: "uml-art", name: "Artifact", families: ["component", "deploy"], w: 150, h: 96, glyph: "art" },
  "uml-node": { type: "uml-node", name: "Node", families: ["deploy"], w: 190, h: 120, glyph: "node" },
  "uml-device": { type: "uml-device", name: "Device", families: ["deploy"], w: 190, h: 110, glyph: "device", stereotype: "device" },
  "uml-exec": { type: "uml-exec", name: "Environment", families: ["deploy"], w: 200, h: 110, glyph: "exec", stereotype: "executionEnvironment" },
  "uml-state": { type: "uml-state", name: "State", families: ["state", "timing"], w: 170, h: 96, glyph: "state" },
  "uml-choice": { type: "uml-choice", name: "Choice", families: ["state"], w: 96, h: 80, glyph: "choice" },
  "uml-hist": { type: "uml-hist", name: "History", families: ["state"], w: 72, h: 72, glyph: "hist" },
  "uml-model": { type: "uml-model", name: "Model", families: ["package"], w: 200, h: 140, glyph: "model", stereotype: "model" },
  "uml-frame": { type: "uml-frame", name: "Frame", families: ["package"], w: 460, h: 300, glyph: "frame" },
  "uml-ball": { type: "uml-ball", name: "Provided", families: ["component"], w: 88, h: 64, glyph: "ball" },
  "uml-socket": { type: "uml-socket", name: "Required", families: ["component"], w: 96, h: 64, glyph: "socket" },
  "uml-dur": { type: "uml-dur", name: "Duration", families: ["timing"], w: 160, h: 56, glyph: "state" },
  "uml-tick": { type: "uml-tick", name: "Tick", families: ["timing"], w: 72, h: 72, glyph: "hist" },
  "uml-iuse": { type: "uml-iuse", name: "Interaction", families: ["overview"], w: 200, h: 80, glyph: "frag", stereotype: "interaction" },
  "uml-iitem": { type: "uml-iitem", name: "Information", families: ["infoflow"], w: 180, h: 72, glyph: "data", stereotype: "information" },
  "uml-profile": { type: "uml-profile", name: "Profile", families: ["profile"], w: 220, h: 140, glyph: "package", stereotype: "profile" },
  "uml-stereo": { type: "uml-stereo", name: "Stereotype", families: ["profile"], w: 180, h: 96, glyph: "class", stereotype: "stereotype" },
  "uml-meta": { type: "uml-meta", name: "Metaclass", families: ["profile"], w: 180, h: 96, glyph: "class", stereotype: "metaclass" },
  "erd-entity": { type: "erd-entity", name: "Entity", families: ["erd"], w: 220, h: 132, glyph: "entity", stereotype: "entity" },
  "erd-weak": { type: "erd-weak", name: "Weak entity", families: ["erd"], w: 220, h: 132, glyph: "weak", stereotype: "weak" },
  "erd-assoc": { type: "erd-assoc", name: "Junction", families: ["erd"], w: 220, h: 148, glyph: "junction", stereotype: "junction" },
  "erd-attr": { type: "erd-attr", name: "Attribute", families: ["erd"], w: 140, h: 64, glyph: "attr" },
  "erd-rel": { type: "erd-rel", name: "Relationship", families: ["erd"], w: 150, h: 96, glyph: "rel" },
  "ai-prompt": { type: "ai-prompt", name: "Prompt", families: ["ai"], w: 200, h: 110, glyph: "prompt", stereotype: "prompt" },
  "ai-model": { type: "ai-model", name: "Model", families: ["ai"], w: 200, h: 120, glyph: "modelcard", stereotype: "model" },
  "ai-data": { type: "ai-data", name: "Dataset", families: ["ai"], w: 200, h: 110, glyph: "dataset", stereotype: "dataset" },
  "ai-embed": { type: "ai-embed", name: "Embedding", families: ["ai"], w: 180, h: 96, glyph: "embed", stereotype: "embedding" },
  "ai-retr": { type: "ai-retr", name: "Retriever", families: ["ai"], w: 180, h: 96, glyph: "retriever", stereotype: "retriever" },
  "ai-agent": { type: "ai-agent", name: "Agent", families: ["ai"], w: 180, h: 110, glyph: "agent", stereotype: "agent" },
  "ai-tool": { type: "ai-tool", name: "Tool", families: ["ai"], w: 160, h: 96, glyph: "tool", stereotype: "tool" },
  "ai-guard": { type: "ai-guard", name: "Guard", families: ["ai"], w: 170, h: 96, glyph: "guard", stereotype: "guard" },
  "ai-eval": { type: "ai-eval", name: "Evaluation", families: ["ai"], w: 190, h: 110, glyph: "eval", stereotype: "evaluation" },
  "ai-serve": { type: "ai-serve", name: "Serving", families: ["ai"], w: 180, h: 96, glyph: "serving", stereotype: "serving" },
  "flow-start": { type: "flow-start", name: "Start", families: ["flowchart"], w: 88, h: 72, glyph: "start" },
  "flow-proc": { type: "flow-proc", name: "Process", families: ["flowchart"], w: 168, h: 64, glyph: "action" },
  "flow-decide": { type: "flow-decide", name: "Decision", families: ["flowchart"], w: 110, h: 88, glyph: "decide" },
  "flow-io": { type: "flow-io", name: "Input", families: ["flowchart"], w: 168, h: 72, glyph: "data", stereotype: "input" },
  "flow-doc": { type: "flow-doc", name: "Document", families: ["flowchart"], w: 150, h: 96, glyph: "art" },
  "flow-end": { type: "flow-end", name: "End", families: ["flowchart"], w: 88, h: 72, glyph: "stop" },
  "mind-topic": { type: "mind-topic", name: "Topic", families: ["mindmap"], w: 180, h: 72, glyph: "case" },
  "mind-idea": { type: "mind-idea", name: "Idea", families: ["mindmap"], w: 150, h: 64, glyph: "case" },
  "c4-person": { type: "c4-person", name: "Person", families: ["c4"], w: 96, h: 132, glyph: "actor" },
  "c4-system": { type: "c4-system", name: "System", families: ["c4"], w: 200, h: 110, glyph: "class", stereotype: "system" },
  "c4-box": { type: "c4-box", name: "Container", families: ["c4"], w: 200, h: 110, glyph: "class", stereotype: "container" },
  "c4-comp": { type: "c4-comp", name: "Component", families: ["c4"], w: 190, h: 110, glyph: "comp", stereotype: "component" },
  "c4-ext": { type: "c4-ext", name: "External", families: ["c4"], w: 200, h: 110, glyph: "class", stereotype: "external" },
  "sys-block": { type: "sys-block", name: "Block", families: ["sysml"], w: 200, h: 132, glyph: "class", stereotype: "block" },
  "sys-req": { type: "sys-req", name: "Requirement", families: ["sysml"], w: 200, h: 110, glyph: "class", stereotype: "requirement" },
  "sys-cons": { type: "sys-cons", name: "Constraint", families: ["sysml"], w: 190, h: 110, glyph: "class", stereotype: "constraint" },
  "sys-port": { type: "sys-port", name: "Port", families: ["sysml"], w: 72, h: 72, glyph: "port" },
  "sys-value": { type: "sys-value", name: "Value", families: ["sysml"], w: 160, h: 80, glyph: "data", stereotype: "value" },
  "bpmn-start": { type: "bpmn-start", name: "Start", families: ["bpmn"], w: 88, h: 72, glyph: "start" },
  "bpmn-task": { type: "bpmn-task", name: "Task", families: ["bpmn"], w: 168, h: 64, glyph: "action" },
  "bpmn-gate": { type: "bpmn-gate", name: "Gateway", families: ["bpmn"], w: 110, h: 88, glyph: "decide" },
  "bpmn-end": { type: "bpmn-end", name: "End", families: ["bpmn"], w: 88, h: 72, glyph: "stop" },
  "bpmn-sub": { type: "bpmn-sub", name: "Subprocess", families: ["bpmn"], w: 180, h: 72, glyph: "action", stereotype: "subprocess" },
  "wf-screen": { type: "wf-screen", name: "Screen", families: ["wireframe"], w: 280, h: 180, glyph: "frame", stereotype: "screen" },
  "wf-nav": { type: "wf-nav", name: "Navigation", families: ["wireframe"], w: 260, h: 56, glyph: "lane" },
  "wf-button": { type: "wf-button", name: "Button", families: ["wireframe"], w: 140, h: 48, glyph: "action" },
  "wf-field": { type: "wf-field", name: "Field", families: ["wireframe"], w: 200, h: 48, glyph: "data", stereotype: "field" },
  "wf-image": { type: "wf-image", name: "Image", families: ["wireframe"], w: 160, h: 110, glyph: "art" },
  "wf-head": { type: "wf-head", name: "Heading", families: ["wireframe"], w: 200, h: 48, glyph: "class", stereotype: "heading" },
  "wf-list": { type: "wf-list", name: "List", families: ["wireframe"], w: 200, h: 120, glyph: "class", stereotype: "list" },
  "aws-ec2": { type: "aws-ec2", name: "EC2", families: ["aws"], w: 160, h: 96, glyph: "node", stereotype: "EC2" },
  "aws-lambda": { type: "aws-lambda", name: "Lambda", families: ["aws"], w: 150, h: 72, glyph: "action", stereotype: "Lambda" },
  "aws-s3": { type: "aws-s3", name: "S3", families: ["aws"], w: 150, h: 96, glyph: "node", stereotype: "S3" },
  "aws-rds": { type: "aws-rds", name: "RDS", families: ["aws"], w: 160, h: 90, glyph: "data", stereotype: "RDS" },
  "aws-vpc": { type: "aws-vpc", name: "VPC", families: ["aws"], w: 280, h: 180, glyph: "bound" },
  "aws-elb": { type: "aws-elb", name: "Load balancer", families: ["aws"], w: 170, h: 80, glyph: "class", stereotype: "ELB" },
  "aws-api": { type: "aws-api", name: "API Gateway", families: ["aws"], w: 170, h: 80, glyph: "class", stereotype: "API Gateway" },
  "aws-cf": { type: "aws-cf", name: "CloudFront", families: ["aws"], w: 160, h: 80, glyph: "class", stereotype: "CloudFront" },
  "aws-sqs": { type: "aws-sqs", name: "SQS", families: ["aws"], w: 150, h: 80, glyph: "class", stereotype: "SQS" },
  "aws-iam": { type: "aws-iam", name: "IAM", families: ["aws"], w: 110, h: 132, glyph: "actor" },
  "gcp-gce": { type: "gcp-gce", name: "Compute Engine", families: ["gcp"], w: 180, h: 96, glyph: "node", stereotype: "GCE" },
  "gcp-run": { type: "gcp-run", name: "Cloud Run", families: ["gcp"], w: 160, h: 72, glyph: "action", stereotype: "Cloud Run" },
  "gcp-func": { type: "gcp-func", name: "Function", families: ["gcp"], w: 150, h: 72, glyph: "action", stereotype: "Function" },
  "gcp-gcs": { type: "gcp-gcs", name: "Cloud Storage", families: ["gcp"], w: 170, h: 96, glyph: "node", stereotype: "GCS" },
  "gcp-sql": { type: "gcp-sql", name: "Cloud SQL", families: ["gcp"], w: 160, h: 90, glyph: "data", stereotype: "Cloud SQL" },
  "gcp-vpc": { type: "gcp-vpc", name: "VPC", families: ["gcp"], w: 280, h: 180, glyph: "bound" },
  "gcp-lb": { type: "gcp-lb", name: "Load balancer", families: ["gcp"], w: 170, h: 80, glyph: "class", stereotype: "LB" },
  "gcp-pub": { type: "gcp-pub", name: "Pub/Sub", families: ["gcp"], w: 150, h: 80, glyph: "class", stereotype: "Pub/Sub" },
  "gcp-iam": { type: "gcp-iam", name: "IAM", families: ["gcp"], w: 110, h: 132, glyph: "actor" },
  "gcp-cdn": { type: "gcp-cdn", name: "CDN", families: ["gcp"], w: 150, h: 80, glyph: "class", stereotype: "CDN" },
  "az-vm": { type: "az-vm", name: "Virtual machine", families: ["azure"], w: 180, h: 96, glyph: "node", stereotype: "VM" },
  "az-func": { type: "az-func", name: "Function", families: ["azure"], w: 150, h: 72, glyph: "action", stereotype: "Function" },
  "az-blob": { type: "az-blob", name: "Blob storage", families: ["azure"], w: 170, h: 96, glyph: "node", stereotype: "Blob" },
  "az-sql": { type: "az-sql", name: "Azure SQL", families: ["azure"], w: 160, h: 90, glyph: "data", stereotype: "Azure SQL" },
  "az-vnet": { type: "az-vnet", name: "Virtual network", families: ["azure"], w: 280, h: 180, glyph: "bound" },
  "az-lb": { type: "az-lb", name: "Load balancer", families: ["azure"], w: 170, h: 80, glyph: "class", stereotype: "LB" },
  "az-apim": { type: "az-apim", name: "API Management", families: ["azure"], w: 180, h: 80, glyph: "class", stereotype: "APIM" },
  "az-queue": { type: "az-queue", name: "Queue", families: ["azure"], w: 150, h: 80, glyph: "class", stereotype: "Queue" },
  "az-ad": { type: "az-ad", name: "Entra ID", families: ["azure"], w: 110, h: 132, glyph: "actor" },
  "az-cdn": { type: "az-cdn", name: "CDN", families: ["azure"], w: 150, h: 80, glyph: "class", stereotype: "CDN" },
};

export const UML_TOOLS: readonly UmlTool[] = Object.values(UML_TOOL_BY_TYPE);

const UML_RELATION_BY_ID: Record<UmlRelation, UmlRelationSpec> = {
  association: { id: "association", name: "Association", families: ["class", "usecase", "object"], dashed: false, end: "none", start: "none", label: "" },
  directed: { id: "directed", name: "Directed association", families: ["class"], dashed: false, end: "open", start: "none", label: "" },
  aggregation: { id: "aggregation", name: "Aggregation", families: ["class"], dashed: false, end: "none", start: "diamond", label: "" },
  composition: { id: "composition", name: "Composition", families: ["class", "sysml"], dashed: false, end: "none", start: "diamond-filled", label: "" },
  generalization: { id: "generalization", name: "Generalization", families: ["class", "usecase"], dashed: false, end: "triangle", start: "none", label: "" },
  realization: { id: "realization", name: "Realization", families: ["class", "component"], dashed: true, end: "triangle", start: "none", label: "" },
  dependency: { id: "dependency", name: "Dependency", families: ["class", "component", "deploy", "object", "package", "sysml", "infoflow"], dashed: true, end: "open", start: "none", label: "" },
  include: { id: "include", name: "Include", families: ["usecase"], dashed: true, end: "open", start: "none", label: "«include»" },
  extend: { id: "extend", name: "Extend", families: ["usecase"], dashed: true, end: "open", start: "none", label: "«extend»" },
  message: { id: "message", name: "Message", families: ["sequence", "timing"], dashed: false, end: "arrow", start: "none", label: "" },
  return: { id: "return", name: "Return", families: ["sequence"], dashed: true, end: "open", start: "none", label: "" },
  create: { id: "create", name: "Create", families: ["sequence"], dashed: true, end: "open", start: "none", label: "«create»" },
  destroy: { id: "destroy", name: "Destroy", families: ["sequence"], dashed: false, end: "arrow", start: "none", label: "«destroy»" },
  transition: { id: "transition", name: "Transition", families: ["activity", "state", "overview"], dashed: false, end: "open", start: "none", label: "" },
  objectflow: { id: "objectflow", name: "Object flow", families: ["activity"], dashed: true, end: "open", start: "none", label: "" },
  assembly: { id: "assembly", name: "Assembly", families: ["component"], dashed: false, end: "ball", start: "none", label: "" },
  communicate: { id: "communicate", name: "Communication path", families: ["deploy"], dashed: false, end: "none", start: "none", label: "" },
  deploy: { id: "deploy", name: "Deployment", families: ["deploy"], dashed: true, end: "open", start: "none", label: "«deploy»" },
  containment: { id: "containment", name: "Containment", families: ["package"], dashed: false, end: "none", start: "plus", label: "" },
  import: { id: "import", name: "Import", families: ["package", "profile"], dashed: true, end: "open", start: "none", label: "«import»" },
  merge: { id: "merge", name: "Merge", families: ["package"], dashed: true, end: "open", start: "none", label: "«merge»" },
  crows: { id: "crows", name: "Crow's foot", families: ["erd"], dashed: false, end: "none", start: "none", label: "" },
  identify: { id: "identify", name: "Identifying", families: ["erd"], dashed: false, end: "open", start: "none", label: "identifying" },
  nonident: { id: "nonident", name: "Non-identifying", families: ["erd"], dashed: true, end: "open", start: "none", label: "" },
  reads: { id: "reads", name: "Reads", families: ["ai"], dashed: true, end: "open", start: "none", label: "«read»" },
  calls: { id: "calls", name: "Calls", families: ["ai"], dashed: false, end: "arrow", start: "none", label: "" },
  grounds: { id: "grounds", name: "Grounds", families: ["ai"], dashed: true, end: "open", start: "none", label: "«grounds»" },
  guards: { id: "guards", name: "Guards", families: ["ai"], dashed: true, end: "open", start: "none", label: "«guards»" },
  trains: { id: "trains", name: "Trains", families: ["ai"], dashed: true, end: "open", start: "none", label: "«trains»" },
  serves: { id: "serves", name: "Serves", families: ["ai"], dashed: false, end: "open", start: "none", label: "«serves»" },
  flow: { id: "flow", name: "Flow", families: ["flowchart"], dashed: false, end: "open", start: "none", label: "" },
  branch: { id: "branch", name: "Branch", families: ["mindmap"], dashed: false, end: "none", start: "none", label: "" },
  c4link: { id: "c4link", name: "Relationship", families: ["c4"], dashed: false, end: "arrow", start: "none", label: "" },
  satisfy: { id: "satisfy", name: "Satisfy", families: ["sysml"], dashed: true, end: "open", start: "none", label: "«satisfy»" },
  trace: { id: "trace", name: "Trace", families: ["sysml"], dashed: true, end: "open", start: "none", label: "«trace»" },
  allocate: { id: "allocate", name: "Allocate", families: ["sysml"], dashed: true, end: "open", start: "none", label: "«allocate»" },
  itemflow: { id: "itemflow", name: "Item flow", families: ["sysml", "infoflow"], dashed: false, end: "arrow", start: "none", label: "" },
  sequence: { id: "sequence", name: "Sequence flow", families: ["bpmn"], dashed: false, end: "arrow", start: "none", label: "" },
  messageflow: { id: "messageflow", name: "Message flow", families: ["bpmn"], dashed: true, end: "arrow", start: "none", label: "" },
  clink: { id: "clink", name: "Link", families: ["wireframe", "aws", "gcp", "azure"], dashed: false, end: "arrow", start: "none", label: "" },
  timecons: { id: "timecons", name: "Time constraint", families: ["timing"], dashed: true, end: "open", start: "none", label: "" },
  extension: { id: "extension", name: "Extension", families: ["profile"], dashed: false, end: "triangle", start: "none", label: "" },
};

export const UML_RELATIONS: readonly UmlRelationSpec[] = Object.values(UML_RELATION_BY_ID);

const DRAW_SIZE: Record<string, { w: number; h: number }> = {
  text: { w: 180, h: 48 },
  box: { w: 160, h: 90 },
  ellipse: { w: 160, h: 90 },
  diamond: { w: 140, h: 110 },
  cylinder: { w: 140, h: 100 },
  cloud: { w: 170, h: 100 },
  note: { w: 160, h: 110 },
};

const SHAPE_SIZE: Record<string, { w: number; h: number }> = { ...DRAW_SIZE };
for (const tool of UML_TOOLS) SHAPE_SIZE[tool.type] = { w: tool.w, h: tool.h };

const SHAPES = new Set<string>([...Object.keys(DRAW_SIZE), ...UML_TOOLS.map((tool) => tool.type)]);

export function isShape(type: string): boolean {
  return SHAPES.has(type);
}

export function umlTool(type: string): UmlTool | undefined {
  if (!Object.prototype.hasOwnProperty.call(UML_TOOL_BY_TYPE, type)) return undefined;
  return UML_TOOL_BY_TYPE[type as UmlNodeType];
}

export function umlGlyph(type: string): UmlGlyph | "" {
  return umlTool(type)?.glyph ?? "";
}

export function toolsFor(family: string): UmlTool[] {
  return UML_TOOLS.filter((tool) => tool.families.includes(family as UmlFamily));
}

export function relationsFor(family: string): UmlRelationSpec[] {
  return UML_RELATIONS.filter((relation) => relation.families.includes(family as UmlFamily));
}

export function relationKindOf(kind?: string): UmlRelation | "" {
  if (kind && Object.prototype.hasOwnProperty.call(UML_RELATION_BY_ID, kind)) return kind as UmlRelation;
  return "";
}

export function relationLook(kind?: string): UmlRelationSpec | null {
  const known = relationKindOf(kind);
  return known ? UML_RELATION_BY_ID[known] : null;
}

export const DATAFLOW_PARTS: readonly { type: "client" | "gateway" | "auth" | "compute" | "cache" | "database" | "queue" | "ci" | "telemetry"; name: string }[] = [
  { type: "client", name: "Client" },
  { type: "gateway", name: "Gateway" },
  { type: "auth", name: "Auth" },
  { type: "compute", name: "Compute" },
  { type: "cache", name: "Cache" },
  { type: "database", name: "Database" },
  { type: "queue", name: "Queue" },
  { type: "ci", name: "CI" },
  { type: "telemetry", name: "Telemetry" },
];

export type ToolboxEntry =
  | { kind: "node"; type: UmlNodeType; name: string }
  | { kind: "relation"; id: UmlRelation; name: string }
  | { kind: "service"; type: (typeof DATAFLOW_PARTS)[number]["type"]; name: string }
  | { kind: "wire"; name: string };

export type ToolboxGroup = { name: string; entries: ToolboxEntry[] };

function nodeEntry(type: UmlNodeType): ToolboxEntry {
  return { kind: "node", type, name: UML_TOOL_BY_TYPE[type].name };
}

function relationEntry(id: UmlRelation): ToolboxEntry {
  return { kind: "relation", id, name: UML_RELATION_BY_ID[id].name };
}

export function toolboxFor(family: string): ToolboxGroup[] {
  if (family === "class") {
    return [
      { name: "Classes (basic)", entries: [nodeEntry("uml-class"), nodeEntry("uml-iface"), relationEntry("association"), relationEntry("directed"), relationEntry("aggregation"), relationEntry("composition"), relationEntry("dependency"), relationEntry("generalization"), relationEntry("realization")] },
      { name: "Classes (advanced)", entries: [nodeEntry("uml-enum"), nodeEntry("uml-data")] },
      { name: "Packages", entries: [nodeEntry("uml-pkg"), nodeEntry("uml-model")] },
      { name: "Composite structure", entries: [nodeEntry("uml-comp"), nodeEntry("uml-port"), relationEntry("assembly")] },
    ];
  }
  if (family === "erd") {
    return [
      { name: "Entities", entries: [nodeEntry("erd-entity"), nodeEntry("erd-weak"), nodeEntry("erd-assoc")] },
      { name: "Attributes", entries: [nodeEntry("erd-attr")] },
      { name: "Relationships", entries: [nodeEntry("erd-rel"), relationEntry("crows"), relationEntry("identify"), relationEntry("nonident")] },
    ];
  }
  if (family === "ai") {
    return [
      { name: "AI design", entries: [nodeEntry("ai-prompt"), nodeEntry("ai-model"), nodeEntry("ai-data"), nodeEntry("ai-embed"), nodeEntry("ai-retr")] },
      { name: "Implementation", entries: [nodeEntry("ai-agent"), nodeEntry("ai-tool"), nodeEntry("ai-guard"), nodeEntry("ai-eval"), nodeEntry("ai-serve"), relationEntry("calls"), relationEntry("grounds"), relationEntry("guards"), relationEntry("reads"), relationEntry("trains"), relationEntry("serves")] },
    ];
  }
  if (family === "dataflow") {
    return [
      { name: "Services", entries: DATAFLOW_PARTS.map((part) => ({ kind: "service", type: part.type, name: part.name })) },
      { name: "Connectors", entries: [{ kind: "wire", name: "Dataflow" }] },
    ];
  }
  if (family === "flowchart") {
    return [
      { name: "Flow", entries: [nodeEntry("flow-start"), nodeEntry("flow-proc"), nodeEntry("flow-decide"), nodeEntry("flow-io"), nodeEntry("flow-doc"), nodeEntry("flow-end")] },
      { name: "Connectors", entries: [relationEntry("flow")] },
    ];
  }
  if (family === "mindmap") {
    return [
      { name: "Topics", entries: [nodeEntry("mind-topic"), nodeEntry("mind-idea")] },
      { name: "Links", entries: [relationEntry("branch")] },
    ];
  }
  if (family === "c4") {
    return [
      { name: "Model", entries: [nodeEntry("c4-person"), nodeEntry("c4-system"), nodeEntry("c4-box"), nodeEntry("c4-comp"), nodeEntry("c4-ext")] },
      { name: "Relationships", entries: [relationEntry("c4link")] },
    ];
  }
  if (family === "sysml") {
    return [
      { name: "Structure", entries: [nodeEntry("sys-block"), nodeEntry("sys-port"), nodeEntry("sys-value"), relationEntry("composition"), relationEntry("itemflow")] },
      { name: "Requirements", entries: [nodeEntry("sys-req"), nodeEntry("sys-cons"), relationEntry("satisfy"), relationEntry("trace"), relationEntry("allocate"), relationEntry("dependency")] },
    ];
  }
  if (family === "bpmn") {
    return [
      { name: "Events", entries: [nodeEntry("bpmn-start"), nodeEntry("bpmn-end")] },
      { name: "Activities", entries: [nodeEntry("bpmn-task"), nodeEntry("bpmn-sub")] },
      { name: "Gateways", entries: [nodeEntry("bpmn-gate")] },
      { name: "Flows", entries: [relationEntry("sequence"), relationEntry("messageflow")] },
    ];
  }
  if (family === "wireframe") {
    return [
      { name: "Screens", entries: [nodeEntry("wf-screen"), nodeEntry("wf-nav"), nodeEntry("wf-head")] },
      { name: "Controls", entries: [nodeEntry("wf-button"), nodeEntry("wf-field"), nodeEntry("wf-image"), nodeEntry("wf-list")] },
      { name: "Links", entries: [relationEntry("clink")] },
    ];
  }
  if (family === "aws") {
    return [
      { name: "Compute", entries: [nodeEntry("aws-ec2"), nodeEntry("aws-lambda")] },
      { name: "Storage", entries: [nodeEntry("aws-s3"), nodeEntry("aws-rds")] },
      { name: "Network", entries: [nodeEntry("aws-vpc"), nodeEntry("aws-elb"), nodeEntry("aws-api"), nodeEntry("aws-cf")] },
      { name: "Integration", entries: [nodeEntry("aws-sqs"), nodeEntry("aws-iam"), relationEntry("clink")] },
    ];
  }
  if (family === "gcp") {
    return [
      { name: "Compute", entries: [nodeEntry("gcp-gce"), nodeEntry("gcp-run"), nodeEntry("gcp-func")] },
      { name: "Storage", entries: [nodeEntry("gcp-gcs"), nodeEntry("gcp-sql")] },
      { name: "Network", entries: [nodeEntry("gcp-vpc"), nodeEntry("gcp-lb"), nodeEntry("gcp-cdn")] },
      { name: "Integration", entries: [nodeEntry("gcp-pub"), nodeEntry("gcp-iam"), relationEntry("clink")] },
    ];
  }
  if (family === "timing") {
    return [
      { name: "Participants", entries: [nodeEntry("uml-life"), nodeEntry("uml-state"), nodeEntry("uml-dur"), nodeEntry("uml-tick")] },
      { name: "Time", entries: [relationEntry("message"), relationEntry("timecons")] },
    ];
  }
  if (family === "overview") {
    return [
      { name: "Flow", entries: [nodeEntry("uml-start"), nodeEntry("uml-action"), nodeEntry("uml-iuse"), nodeEntry("uml-decide"), nodeEntry("uml-fork"), nodeEntry("uml-stop")] },
      { name: "Connectors", entries: [relationEntry("transition")] },
    ];
  }
  if (family === "infoflow") {
    return [
      { name: "Ends", entries: [nodeEntry("uml-class"), nodeEntry("uml-actor"), nodeEntry("uml-iitem")] },
      { name: "Flows", entries: [relationEntry("itemflow"), relationEntry("dependency")] },
    ];
  }
  if (family === "profile") {
    return [
      { name: "Definitions", entries: [nodeEntry("uml-profile"), nodeEntry("uml-stereo"), nodeEntry("uml-meta")] },
      { name: "Relations", entries: [relationEntry("extension"), relationEntry("import")] },
    ];
  }
  if (family === "azure") {
    return [
      { name: "Compute", entries: [nodeEntry("az-vm"), nodeEntry("az-func")] },
      { name: "Storage", entries: [nodeEntry("az-blob"), nodeEntry("az-sql")] },
      { name: "Network", entries: [nodeEntry("az-vnet"), nodeEntry("az-lb"), nodeEntry("az-apim"), nodeEntry("az-cdn")] },
      { name: "Integration", entries: [nodeEntry("az-queue"), nodeEntry("az-ad"), relationEntry("clink")] },
    ];
  }
  const named = UML_FAMILIES.find((item) => item.id === family)?.name ?? "Diagram";
  return [{
    name: named,
    entries: [
      ...toolsFor(family).map((tool) => nodeEntry(tool.type)),
      ...relationsFor(family).map((relation) => relationEntry(relation.id)),
    ],
  }];
}

export type CrowMark = "one" | "many" | "optional" | "optional-many";

export function crowMark(mult?: string): CrowMark {
  const text = (mult ?? "").replace(/\s/g, "");
  if (!text || text === "1" || text === "1..1") return "one";
  if (text === "0..1") return "optional";
  const optional = text.startsWith("0");
  const many = text.includes("*") || /n/i.test(text) || /[2-9]/.test(text.split("..")[1] ?? "");
  if (optional && many) return "optional-many";
  if (many) return "many";
  if (optional) return "optional";
  return "one";
}

export type UmlVisibility = "public" | "private" | "protected" | "package";

export function visibilityOf(value: unknown): UmlVisibility | "" {
  if (value === "public" || value === "private" || value === "protected" || value === "package") return value;
  return "";
}

export function memberLine(line: string, visibility?: string): string {
  if (/^[+\-#~]/.test(line) || /^(PK|FK)\b/i.test(line)) return line;
  const mark = visibility === "private" ? "- " : visibility === "protected" ? "# " : visibility === "package" ? "~ " : visibility === "public" ? "+ " : "";
  return mark ? `${mark}${line}` : line;
}

export function boardText(value: unknown, limit = 4000): string {
  if (typeof value !== "string") return "";
  return value.replaceAll("\u0000", "").slice(0, limit);
}

export function compartmentLines(value: string | undefined): string[] {
  if (!value) return [];
  return value.split(/\r?\n/).map((line) => line.trim()).filter(Boolean).slice(0, 24);
}

export function stereotypeLabel(value: string | undefined): string {
  const text = (value ?? "").trim();
  if (!text) return "";
  if (text.startsWith("«") && text.endsWith("»")) return text;
  return `«${text.replace(/^<<|>>$/g, "")}»`;
}

export function defaultSize(type: string): { w: number; h: number } {
  return SHAPE_SIZE[type] ?? { w: 144, h: 112 };
}

export function nodeSize(node: { type?: string; w?: number; h?: number }): { w: number; h: number } {
  const fallback = defaultSize(node.type ?? "");
  return {
    w: node.w && node.w > 0 ? node.w : fallback.w,
    h: node.h && node.h > 0 ? node.h : fallback.h,
  };
}

export function anchors(node: { x: number; y: number; type?: string; w?: number; h?: number }): {
  inn: { x: number; y: number };
  out: { x: number; y: number };
} {
  const size = nodeSize(node);
  return {
    inn: { x: node.x, y: node.y + size.h / 2 },
    out: { x: node.x + size.w, y: node.y + size.h / 2 },
  };
}

export function boardExtent(nodes: Array<{ x: number; y: number; type?: string; w?: number; h?: number }>): { w: number; h: number } {
  let w = 1600;
  let h = 1100;
  for (const node of nodes) {
    const size = nodeSize(node);
    w = Math.max(w, node.x + size.w + 120);
    h = Math.max(h, node.y + size.h + 120);
  }
  return { w, h };
}

export function snapCoord(value: number, step = 20): number {
  return Math.round(value / step) * step;
}

export function wireStyleOf(style?: string): WireStyle {
  if (style === "elbow" || style === "straight" || style === "curve") return style;
  return "curve";
}

export function wirePath(x1: number, y1: number, x2: number, y2: number, style: WireStyle): string {
  if (style === "straight") return `M ${x1} ${y1} L ${x2} ${y2}`;
  if (style === "elbow") {
    const mid = (x1 + x2) / 2;
    return `M ${x1} ${y1} L ${mid} ${y1} L ${mid} ${y2} L ${x2} ${y2}`;
  }
  const dx = Math.max(40, Math.abs(x2 - x1) * 0.45);
  return `M ${x1} ${y1} C ${x1 + dx} ${y1}, ${x2 - dx} ${y2}, ${x2} ${y2}`;
}

export function loopPath(x: number, y: number): string {
  return `M ${x} ${y} C ${x + 64} ${y - 28}, ${x + 64} ${y + 64}, ${x} ${y + 36}`;
}

export function pointOnWire(x1: number, y1: number, x2: number, y2: number, t: number, style: WireStyle): { x: number; y: number } {
  const clamped = Math.min(1, Math.max(0, t));
  if (style === "straight") {
    return { x: x1 + (x2 - x1) * clamped, y: y1 + (y2 - y1) * clamped };
  }
  if (style === "elbow") {
    const mid = (x1 + x2) / 2;
    const segs = [
      { x1, y1, x2: mid, y2: y1 },
      { x1: mid, y1, x2: mid, y2 },
      { x1: mid, y1: y2, x2, y2 },
    ];
    const lengths = segs.map((seg) => Math.hypot(seg.x2 - seg.x1, seg.y2 - seg.y1));
    const total = lengths.reduce((sum, length) => sum + length, 0) || 1;
    let remain = clamped * total;
    for (let index = 0; index < segs.length; index += 1) {
      const length = lengths[index] ?? 0;
      const seg = segs[index];
      if (!seg) break;
      if (remain <= length || index === segs.length - 1) {
        const along = length === 0 ? 0 : remain / length;
        return { x: seg.x1 + (seg.x2 - seg.x1) * along, y: seg.y1 + (seg.y2 - seg.y1) * along };
      }
      remain -= length;
    }
  }
  const dx = Math.max(40, Math.abs(x2 - x1) * 0.45);
  const c1x = x1 + dx;
  const c1y = y1;
  const c2x = x2 - dx;
  const c2y = y2;
  const mt = 1 - clamped;
  return {
    x: mt * mt * mt * x1 + 3 * mt * mt * clamped * c1x + 3 * mt * clamped * clamped * c2x + clamped * clamped * clamped * x2,
    y: mt * mt * mt * y1 + 3 * mt * mt * clamped * c1y + 3 * mt * clamped * clamped * c2y + clamped * clamped * clamped * y2,
  };
}
