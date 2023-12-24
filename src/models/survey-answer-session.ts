import { Survey } from "./survey";
import { SurveyAnswer } from "./survey-answer";
import { SurveyTargetAudience } from "./survey-target-audience";

export interface SurveyAnswerSession {
  name?: string;
  username?: string;
  password?: string;
  ownerCode?: string;
  score?: number;
  completed?: boolean;
  scorePercent?: number;
  answers: SurveyAnswer[];
  targetAudience: SurveyTargetAudience;
  survey: Survey;
}
