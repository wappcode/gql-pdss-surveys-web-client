export type SurveyConfigurationType = 'VALIDATOR' | 'PRESENTATION' | 'CONDITION' | 'ANSWER_SCORE';
export interface SurveyConfiguration<T> {
  id: string;
  value: T;
  type: SurveyConfigurationType;
  created: Date;
  updated: Date;
}
export interface SurveyConfigurationInput {
  type: SurveyConfigurationType;
  value: string;
}
