import { describe, expect, test } from 'vitest';
import { queryExecutor } from './query-executor';
import { surveyContent, surveyContentConnection } from '../src/lib/survey-content.fn';

describe('Survey content Functions Test', async () => {
  test('Test survey connection', async () => {
    const connection = await surveyContentConnection(queryExecutor);
    expect(connection.totalCount).toBeGreaterThan(0);
  });

  test('Test survey content null', async () => {
    const surveyItem = await surveyContent(queryExecutor, '0');
    expect(surveyItem).toBeFalsy();
  });
  test('Test survey content not null', async () => {
    const surveyItem = await surveyContent(queryExecutor, '1');
    expect(surveyItem).toBeTruthy();
  });
});
