import { SurveyConfiguration, SurveyConfigurationInput } from './survey-configuration';

export type SurveyContentType = 'HTML' | 'DIVIDER' | 'IMAGE' | 'VIDEO' | 'AUDIO' | 'ANY';
export interface SurveyContent<PT = unknown> {
  id: string;
  type: SurveyContentType;
  body: string;
  presentation?: SurveyConfiguration<PT>;
  created: Date;
  updated: Date;
}
export interface SurveyContentInput {
  type: SurveyContentType;
  body: string;
  presentation: string;
}
export interface BuildSurveyContentInput {
  type: SurveyContentType;
  body: string;
  presentation?: SurveyConfigurationInput;
}
