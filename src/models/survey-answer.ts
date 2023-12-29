import { SurveyAnswerSession } from './survey-answer-session';
import { SurveyQuestion } from './survey-question';

export interface SurveyAnswer<T = string> {
  value?: T;
  question: SurveyQuestion;
  score?: number;
  scorePercent?: number;
  session: SurveyAnswerSession;
  created: Date;
  updated: Date;
}
