import { SurveyQuestion, SurveySection, SurveyTargetAudience } from '.';

export interface Survey {
  title: string;
  targetAudiences: SurveyTargetAudience;
  questions: SurveyQuestion[];
  sections: SurveySection[];
  created: Date;
  updated: Date;
}
