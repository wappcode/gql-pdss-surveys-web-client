import { Survey } from './survey';
import { SurveyConfiguration, SurveyConfigurationInput } from './survey-configuration';
import { BuildSurveyContentInput, SurveyContent } from './survey-content';
import { BuildSurveyQuestionOptionInput, SurveyQuestionOption } from './survey-question-option';

export interface SurveyQuestion<
  QC = unknown,
  QP = unknown,
  QV = unknown,
  QAS = unknown,
  OCT = unknown,
  OPT = unknown
> {
  id: string;
  title: string;
  code: string;
  type: string;
  required: boolean;
  other: boolean;
  hint?: string;
  options: SurveyQuestionOption<OCT, OPT>[];
  content?: SurveyContent<QC>;
  presentation?: SurveyConfiguration<QP>;
  validators?: SurveyConfiguration<QV[]>;
  answerScore?: SurveyConfiguration<QAS>;
  score?: number;
  survey: Survey;
  created: Date;
  updated: Date;
}
export interface SurveyQuestionInput {
  title: string;
  code: string;
  type: string;
  required: boolean;
  other?: boolean;
  hint?: string;
  content?: string;
  presentation?: string;
  validators?: string;
  answerScore?: string;
  score: number;
  survey: string;
}

export interface BuildSurveyQuestionInput {
  title: string;
  code: string;
  type: string;
  required: boolean;
  other?: boolean;
  hint?: string;
  options?: BuildSurveyQuestionOptionInput[];
  content?: BuildSurveyContentInput;
  presentation?: SurveyConfigurationInput;
  validators?: SurveyConfigurationInput;
  answerScore?: SurveyConfigurationInput;
  score?: number;
}
