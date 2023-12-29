import { SurveyConfiguration } from './survey-configuration';

export type SurveyContentType = 'HTML' | 'DIVIDER' | 'IMAGE' | 'VIDEO' | 'AUDIO' | 'ANY';
export interface SurveyContent<PT = unknown> {
  type: SurveyContentType;
  body: string;
  presentation?: SurveyConfiguration<PT>;
  created: Date;
  updated: Date;
}
