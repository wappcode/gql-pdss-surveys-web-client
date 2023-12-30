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
  created: Date;
  updated: Date;
}
export interface SurveyInput {
  title: string;
}

export interface BuildSurveyInput {
  title: string;
  targetAudience?: BuildSurveyTargetAudienceInput;
  sections: BuildSurveySectionInput[];
}
