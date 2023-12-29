import { describe, expect, test } from 'vitest';
import { queryExecutor } from './query-executor';
import {
  surveyQuestionOption,
  surveyQuestionOptionConnection
} from '../src/lib/survey-question-option.fn';

describe('Survey option Functions Test', async () => {
  test('Test survey connection', async () => {
    const connection = await surveyQuestionOptionConnection(queryExecutor);
    expect(connection.totalCount).toBeGreaterThan(0);
  });

  test('Test survey option null', async () => {
    const surveyItem = await surveyQuestionOption(queryExecutor, '0');
    expect(surveyItem).toBeFalsy();
  });
  test('Test survey option not null', async () => {
    const surveyItem = await surveyQuestionOption(queryExecutor, '1');
    expect(surveyItem).toBeTruthy();
  });
});
