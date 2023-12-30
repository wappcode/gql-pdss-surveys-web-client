import {
  BuildSurveySectionInput,
  BuildSurveyTargetAudienceInput,
  SurveyQuestion,
  SurveySection,
  SurveyTargetAudience
} from '.';

export interface Survey {
  id: string;
  title: string;
  targetAudiences: SurveyTargetAudience;
  questions: SurveyQuestion[];
  sections: SurveySection[];
  active: boolean;
  created: Date;
  updated: Date;
}
export interface SurveyInput {
  title: string;
  active: boolean;
}

export interface BuildSurveyInput {
  title: string;
  targetAudience?: BuildSurveyTargetAudienceInput;
  sections: BuildSurveySectionInput[];
  active: boolean;
}
