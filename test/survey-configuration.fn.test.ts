import { describe, expect, test } from 'vitest';
import { queryExecutor } from './query-executor';
import {
  getSurveyConfiguration,
  getSurveyConfigurations
} from '../src/lib/survey-configuration.fn';

describe('Survey configuration Functions Test', async () => {
  test('Test survey connection', async () => {
    const connection = await getSurveyConfigurations(queryExecutor);
    expect(connection.totalCount).toBeGreaterThan(0);
  });

  test('Test survey configuration null', async () => {
    const surveyItem = await getSurveyConfiguration(queryExecutor, '0');
    expect(surveyItem).toBeFalsy();
  });
  test('Test survey configuration not null', async () => {
    const surveyItem = await getSurveyConfiguration(queryExecutor, '1');
    expect(surveyItem).toBeTruthy();
  });
});
