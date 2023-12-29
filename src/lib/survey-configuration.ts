import { SurveyConfiguration } from '../models';

export const standardizeSurveyConfiguration = <T>(
  config?: SurveyConfiguration<T>
): SurveyConfiguration<T> | undefined => {
  if (!config) {
    return config;
  }
  const value = JSON.parse(config.value as unknown as string);
  return { ...config, value };
};
