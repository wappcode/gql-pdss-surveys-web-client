import { Survey } from './survey';
import { SurveyConfiguration } from './survey-configuration';
import { SurveyContent } from './survey-content';
import { SurveyQuestionOption } from './survey-question-option';

export interface SurveyQuestion<
  QC = unknown,
  QP = unknown,
  QV = unknown,
  QAS = unknown,
  OCT = unknown,
  OPT = unknown
> {
  title: string;
  code: string;
  type: string;
  required: boolean;
  other: boolean;
  hint?: string;
  options?: SurveyQuestionOption<OCT, OPT>[];
  content?: SurveyContent<QC>;
  presentation?: SurveyConfiguration<QP>;
  validators?: SurveyConfiguration<QV[]>;
  answerScore?: SurveyConfiguration<QAS>;
  score?: number;
  survey: Survey;
  created: Date;
  updated: Date;
}
