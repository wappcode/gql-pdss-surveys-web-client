import { SurveyConfiguration, SurveyConfigurationInput } from './survey-configuration';
import { BuildSurveyContentInput, SurveyContent } from './survey-content';
import { BuildSurveyQuestionInput, SurveyQuestion } from './survey-question';
import { SurveySection } from './survey-section';

export type SurveySectionItemType = 'QUESTION' | 'CONTENT';

// IDC = Item Conditions
// ICT = Item Content
export interface SurveySectionItem<
  ICD = unknown,
  ICT = unknown,
  QC = unknown,
  QP = unknown,
  QV = unknown,
  QAS = unknown,
  OCT = unknown,
  OPT = unknown
> {
  id: string;
  type: SurveySectionItemType;
  order: number;
  conditions?: SurveyConfiguration<ICD>;
  question?: SurveyQuestion<QC, QP, QV, QAS, OCT, OPT>;
  content?: SurveyContent<ICT>;
  section: SurveySection;
  hidden: boolean;
  created: Date;
  updated: Date;
}
export interface SurveySectionItemInput {
  type: SurveySectionItemType;
  order: number;
  conditions?: string;
  question?: string;
  content?: string;
  section: string;
  hidden: boolean;
}

export interface BuildSurveySectionItemInput {
  type: SurveySectionItemType;
  order: number;
  hidden: boolean;
  conditions?: SurveyConfigurationInput;
  question?: BuildSurveyQuestionInput;
  content?: BuildSurveyContentInput;
  id?: string;
  section?: string;
}
