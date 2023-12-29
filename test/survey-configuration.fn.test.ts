import { describe, expect, test } from 'vitest';
import { queryExecutor } from './query-executor';
import {
  surveyConfiguration,
  surveyConfigurationConnection
} from '../src/lib/survey-configuration.fn';

describe('Survey configuration Functions Test', async () => {
  test('Test survey connection', async () => {
    const connection = await surveyConfigurationConnection(queryExecutor);
    expect(connection.totalCount).toBeGreaterThan(0);
  });

  test('Test survey configuration null', async () => {
    const surveyItem = await surveyConfiguration(queryExecutor, '0');
    expect(surveyItem).toBeFalsy();
  });
  test('Test survey configuration not null', async () => {
    const surveyItem = await surveyConfiguration(queryExecutor, '1');
    expect(surveyItem).toBeTruthy();
  });
});
