import { SurveyAnswerSession } from './survey-answer-session';
import { SurveyQuestion } from './survey-question';

export interface SurveyAnswer<T = string> {
  id: string;
  value?: T;
  question: SurveyQuestion;
  score?: number;
  scorePercent?: number;
  session: SurveyAnswerSession;
  created: Date;
  updated: Date;
}
export interface SurveyAnswerInput {
  value: string;
  question: string;
  score?: number;
  scorePercent?: number;
  session: string;
}
export interface SurveyAnswerQuestionInput {
  questionId: string;
  value: string;
}
