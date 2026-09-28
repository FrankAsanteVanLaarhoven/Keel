import type { DecisionCopy } from "../course/types";
import type { OpsId } from "./meta";

export type OpsFieldCopy = { prompt: string; options: string[] };

export type OpsLink = { href: string; label: string };

export type OpsSectionCopy = {
  title: string;
  promise: string;
  objectives: [string, string, string];
  start: [string, string];
  how: [string, string];
  expert: [string, string];
  figure: string;
  links: OpsLink[];
  narration: string;
  checkPrompt: string;
  checkOptions: [string, string, string, string];
  labTitle: string;
  labScene: [string, string];
  labWarn: string;
  fields: Record<string, OpsFieldCopy>;
  caseOrg: string;
  caseFile: string;
  caseTitle: string;
  caseSituation: [string, string];
  caseTask: string;
  caseSteps: [string, string, string, string];
  decisions: [DecisionCopy, DecisionCopy, DecisionCopy];
  noteLabel: string;
  noteHint: string;
};

export type OpsBriefCopy = {
  title: string;
  dek: string;
  situation: [string, string];
  task: string;
  steps: [string, string, string, string];
  decisions: [DecisionCopy, DecisionCopy, DecisionCopy, DecisionCopy];
  noteLabel: string;
  noteHint: string;
  narration: string;
  figure: string;
};

export type OpsPack = {
  sections: Record<OpsId, OpsSectionCopy>;
  brief: OpsBriefCopy;
};
