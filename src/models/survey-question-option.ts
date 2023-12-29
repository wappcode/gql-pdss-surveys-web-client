import { SurveyConfiguration } from './survey-configuration';
import { SurveyContent } from './survey-content';
import { SurveyQuestion } from './survey-question';

export interface SurveyQuestionOption<VT = string, CT = unknown, PT = unknown> {
  value?: VT;
  title: string;
  order: number;
  content: SurveyContent<PT>;
  presentation: SurveyConfiguration<CT>;
  question: SurveyQuestion;
  created: Date;
  updated: Date;
}
