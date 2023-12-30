import { Survey } from './survey';
import { SurveyConfiguration, SurveyConfigurationInput } from './survey-configuration';
import { BuildSurveyContentInput, SurveyContent } from './survey-content';

// WC = Welcome content
// FC = Farewell content
// PT = Presentation Type
export interface SurveyTargetAudience<WC = unknown, FC = unknown, PT = unknown> {
  id: string;
  title: string;
  starts?: Date;
  ends?: Date;
  welcome?: SurveyContent<WC>;
  farewell?: SurveyContent<FC>;
  attempts?: number;
  survey: Survey;
  presentation?: SurveyConfiguration<PT>;
  created: Date;
  updated: Date;
}
export interface SurveyTargetAudienceInput {
  title: string;
  starts?: string;
  ends?: string;
  welcome?: string;
  farewell?: string;
  attempts?: number;
  survey: string;
  presentation?: string;
}
export interface BuildSurveyTargetAudienceInput {
  title: string;
  starts?: Date;
  ends?: Date;
  welcome?: BuildSurveyContentInput;
  farewell?: BuildSurveyContentInput;
  attempts?: number;
  presentation?: SurveyConfigurationInput;
}
