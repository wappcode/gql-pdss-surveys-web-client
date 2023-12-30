import { Survey } from './survey';
import { SurveyConfiguration, SurveyConfigurationInput } from './survey-configuration';
import { BuildSurveyContentInput, SurveyContent } from './survey-content';
import { BuildSurveySectionItemInput, SurveySectionItem } from './survey-section-item';

// SC = Section Content
// SP = Section Presentation
export interface SurveySection<SC = unknown, SP = unknown> {
  id: string;
  title: string;
  content?: SurveyContent<SC>;
  items: SurveySectionItem[];
  order: number;
  hidden: boolean;
  presentation?: SurveyConfiguration<SP>;
  survey: Survey;
  created: Date;
  updated: Date;
}
export interface SurveySectionInput {
  title: string;
  content?: string;
  order: number;
  hidden: boolean;
  presentation?: string;
  survey: string;
}
export interface BuildSurveySectionInput {
  title: string;
  content: BuildSurveyContentInput;
  presentation: SurveyConfigurationInput;
  order: number;
  hidden: boolean;
  items: BuildSurveySectionItemInput[];
}
