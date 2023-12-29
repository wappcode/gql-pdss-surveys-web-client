import { describe, expect, test } from 'vitest';
import { queryExecutor } from './query-executor';
import { surveyAnswerConnection, surveyAnswer } from '../src/lib/survey-answer.fn';

describe('Survey Answer Functions Test', async () => {
  test('Test survey connection', async () => {
    const connection = await surveyAnswerConnection(queryExecutor);
    expect(connection.totalCount).toBeGreaterThan(0);
  });

  test('Test survey answer null', async () => {
    const surveyItem = await surveyAnswer(queryExecutor, '0');
    expect(surveyItem).toBeFalsy();
  });
  test('Test survey answer not null', async () => {
    const surveyItem = await surveyAnswer(queryExecutor, '1');
    expect(surveyItem).toBeTruthy();
  });
});
