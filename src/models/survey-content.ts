import { SurveyConfiguration } from "./survey-configuration";

export interface SurveyContent<PT = unknown> {
  type: string;
  body: string;
  presentation?: SurveyConfiguration<PT>;
}
