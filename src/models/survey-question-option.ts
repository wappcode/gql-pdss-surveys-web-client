import { SurveyConfiguration, SurveyConfigurationInput } from './survey-configuration';
import { BuildSurveyContentInput, SurveyContent } from './survey-content';
import { SurveyQuestion } from './survey-question';

export interface SurveyQuestionOption<CT = unknown, PT = unknown> {
  id: string;
  value: string;
  title: string;
  order: number;
  content?: SurveyContent<CT>;
  presentation?: SurveyConfiguration<PT>;
  question: SurveyQuestion;
  created: Date;
  updated: Date;
}
export interface SurveyQuestionOptionInput {
  value: string;
  title: string;
  order: number;
  content?: string;
  presentation?: string;
  question: string;
}
export interface BuildSurveyQuestionOptionInput {
  title: string;
  value: string;
  order: number;
  content?: BuildSurveyContentInput;
  presentation?: SurveyConfigurationInput;
}
