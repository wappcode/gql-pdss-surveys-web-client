import { Survey } from "./survey";
import { SurveyConfiguration } from "./survey-configuration";
import { SurveyContent } from "./survey-content";

// WC = Welcome content
// FC = Farewell content
// PT = Presentation Type
export interface SurveyTargetAudience<
  WC = unknown,
  FC = unknown,
  PT = unknown,
> {
  title: string;
  starts?: Date;
  ends?: Date;
  welcome: SurveyContent<WC>;
  farewell: SurveyContent<FC>;
  attempts?: number;
  survey: Survey;
  presentation: SurveyConfiguration<PT>;
}
