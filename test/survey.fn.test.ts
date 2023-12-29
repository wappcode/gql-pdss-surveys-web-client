import { describe, expect, test } from 'vitest';
import { queryExecutor } from './query-executor';
import { survey, surveyConnection } from '../src/lib/survey.fn';

describe('Survey Functions Test', async () => {
  test('Test survey connection', async () => {
    const connection = await surveyConnection(queryExecutor);
    expect(connection.totalCount).toBeGreaterThan(0);
  });

  test('Test survey null', async () => {
    const surveyItem = await survey(queryExecutor, '1');
    expect(surveyItem).toBeFalsy();
  });
  test('Test survey not null', async () => {
    const surveyItem = await survey(queryExecutor, 'gqt03d4086ab23209f12247449ec693aa05');
    expect(surveyItem).toBeTruthy();
  });
});
