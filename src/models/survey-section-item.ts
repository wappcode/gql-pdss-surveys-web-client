import { SurveyConfiguration } from './survey-configuration';
import { SurveyContent } from './survey-content';
import { SurveyQuestion } from './survey-question';
import { SurveySection } from './survey-section';

export enum SurveySectionItemType {
  question = 'QUESTION',
  content = 'CONTENT'
}
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
