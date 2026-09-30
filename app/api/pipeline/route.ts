import { guard, json, settle } from "@/lib/http";
import { PipelineError, type DatasetFile, type OutputKind } from "@/lib/pipeline";
import {
  createPipelineBranch,
  deliverBranch,
  landDataset,
  openOrdersSample,
  pipelineView,
  previewTransform,
  removeTransform,
  saveTransform,
} from "@/lib/pipeline-store";
import { userFrom } from "@/lib/ready";

export const runtime = "nodejs";
export const maxDuration = 30;

export function GET(request: Request) {
  return settle(async () => {
    const user = await userFrom(request);
    if (!user) return json({ error: "auth" }, 401);
    const branch = new URL(request.url).searchParams.get("branch") || "main";
    try {
      return json(await pipelineView(user.id, branch));
    } catch (error) {
      return failure(error);
    }
  });
}

export function POST(request: Request) {
  return settle(async () => {
    const user = await userFrom(request);
    if (!user) return json({ error: "auth" }, 401);
    const gated = await guard(request, "pipeline", 60, 60 * 60 * 1000, user.id, 600_000);
    if (gated.error || !gated.body || typeof gated.body !== "object") return gated.error ?? json({ error: "body" }, 400);
    const body = gated.body as Record<string, unknown>;
    const action = typeof body.action === "string" ? body.action : "";
    const branch = typeof body.branch === "string" && body.branch ? body.branch : "main";
    try {
      if (action === "land") return json(await landDataset(user.id, branch, text(body.name), filesOf(body.files)));
      if (action === "branch") return json(await createPipelineBranch(user.id, text(body.name), text(body.from) || branch));
      if (action === "transform") {
        return json(await saveTransform(user.id, branch, {
          id: text(body.id),
          name: text(body.name),
          inputs: stringList(body.inputs),
          statement: text(body.statement),
          outputName: text(body.outputName),
          outputKind: body.outputKind === "object" ? "object" : "dataset" satisfies OutputKind,
          objectType: text(body.objectType),
          grain: text(body.grain),
        }));
      }
      if (action === "remove") return json(await removeTransform(user.id, branch, text(body.id)));
      if (action === "preview") return json({ preview: await previewTransform(user.id, branch, text(body.id)) });
      if (action === "deliver") return json(await deliverBranch(user.id, branch));
      if (action === "sample") return json(await openOrdersSample(user.id, branch));
      return json({ error: "body" }, 400);
    } catch (error) {
      return failure(error);
    }
  });
}

function failure(error: unknown) {
  if (error instanceof PipelineError) return json({ error: error.code }, 400);
  throw error;
}

function text(value: unknown): string {
  return typeof value === "string" ? value : "";
}

function stringList(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === "string");
}

function filesOf(value: unknown): DatasetFile[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((item) => {
    if (!item || typeof item !== "object") return [];
    const file = item as { name?: unknown; text?: unknown };
    if (typeof file.name !== "string" || typeof file.text !== "string") return [];
    return [{ name: file.name, text: file.text }];
  });
}
