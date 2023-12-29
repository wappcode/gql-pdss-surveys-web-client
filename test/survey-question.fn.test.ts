import { describe, expect, test } from 'vitest';
import { queryExecutor } from './query-executor';
import { surveyQuestionConnection, surveyQuestion } from '../src/lib/survey-question.fn';

describe('Survey question Functions Test', async () => {
  test('Test survey connection', async () => {
    const connection = await surveyQuestionConnection(queryExecutor);
    expect(connection.totalCount).toBeGreaterThan(0);
  });

  test('Test survey question null', async () => {
    const surveyItem = await surveyQuestion(queryExecutor, '0');
    expect(surveyItem).toBeFalsy();
  });
  test('Test survey question not null', async () => {
    const surveyItem = await surveyQuestion(queryExecutor, 'qvcafc7b276826d788ccdf62dd08a5b8344');
    expect(surveyItem).toBeTruthy();
  });
});
