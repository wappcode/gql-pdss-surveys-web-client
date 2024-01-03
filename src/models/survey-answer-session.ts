import { Survey } from './survey';
import { SurveyAnswer, SurveyAnswerQuestionInput } from './survey-answer';
import { SurveyTargetAudience } from './survey-target-audience';

export interface SurveyAnswerSession {
  id: string;
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
  created: Date;
  updated: Date;
}
export interface SurveyAnswerSessionInput {
  name?: string;
  username?: string;
  password?: string;
  ownerCode?: string;
  score?: number;
  scorePercent?: number;
  answers?: SurveyAnswerQuestionInput[];
  targetAudience: string;
  completed?: boolean;
}
