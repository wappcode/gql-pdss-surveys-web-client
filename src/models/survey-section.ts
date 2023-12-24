import { Survey } from "./survey";
import { SurveyConfiguration } from "./survey-configuration";
import { SurveyContent } from "./survey-content";
import { SurveySectionItem } from "./survey-section-item";

// SC = Section Content
// SP = Section Presentation
export interface SurveySection<SC = unknown, SP = unknown> {
  title: string;
  content?: SurveyContent<SC>;
  items: SurveySectionItem;
  order: number;
  hidden: boolean;
  presentation: SurveyConfiguration<SP>;
  survey: Survey;
}
