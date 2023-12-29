import { SurveyConfiguration } from './survey-configuration';
import { SurveyContent } from './survey-content';
import { SurveyQuestion } from './survey-question';

export interface SurveyQuestionOption<CT = unknown, PT = unknown> {
  value: string;
  title: string;
  order: number;
  content?: SurveyContent<CT>;
  presentation?: SurveyConfiguration<PT>;
  question: SurveyQuestion;
  created: Date;
  updated: Date;
}
