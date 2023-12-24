import { SurveyConfiguration } from "./survey-configuration";
import { SurveyContent } from "./survey-content";
import { SurveyQuestion } from "./survey-question";
import { SurveySection } from "./survey-section";

export enum SurveySectionItemType {
  question = "QUESTION",
  content = "CONTENT",
}
// IDC = Item Conditions
// ICT = Item Content
export interface SurveySectionItem<ICD = unknown, ICT = unknown> {
  type: SurveySectionItemType;
  order: number;
  conditions?: SurveyConfiguration<ICD>;
  question?: SurveyQuestion;
  content?: SurveyContent<ICT>;
  section: SurveySection;
  hidden: boolean;
}
