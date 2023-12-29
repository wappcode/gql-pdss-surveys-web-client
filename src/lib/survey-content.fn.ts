import { SurveyContent } from '../models';
import { standardizeSurveyConfiguration } from './survey-configuration';

export const standardizeSurveyContent = <PT>(
  content?: SurveyContent<PT>
): SurveyContent<PT> | undefined => {
  if (!content) {
    return content;
  }
  const presentation = standardizeSurveyConfiguration<PT>(content.presentation);
  return { ...content, presentation };
};
