import type { SectionId } from "./meta";

export type DecisionCopy = { prompt: string; options: [string, string, string] };

export type SectionCopy = {
  title: string;
  promise: string;
  objectives: [string, string, string];
  start: [string, string];
  how: [string, string];
  expert: [string, string];
  example: [string, string];
  narration: string;
  checkPrompt: string;
  checkOptions: [string, string, string, string];
  benchTitle: string;
  benchPrompt: string;
  benchItems: string[];
  benchSlots: string[];
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

export type BriefCopy = {
  title: string;
  dek: string;
  situation: [string, string];
  task: string;
  steps: [string, string, string, string];
  decisions: DecisionCopy[];
  noteLabel: string;
  noteHint: string;
  narration: string;
};

export type Pack = {
  sections: Record<SectionId, SectionCopy>;
  brief: BriefCopy;
};
