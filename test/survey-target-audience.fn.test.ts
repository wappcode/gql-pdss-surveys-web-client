import { describe, expect, test } from 'vitest';
import { queryExecutor } from './query-executor';
import {
  surveyTargetAudienceConnection,
  surveyTargetAudience
} from '../src/lib/survey-target-audience.fn';

describe('Survey Target Audience Functions Test', async () => {
  test('Test survey connection', async () => {
    const connection = await surveyTargetAudienceConnection(queryExecutor);
    expect(connection.totalCount).toBeGreaterThan(0);
  });

  test('Test survey audience null', async () => {
    const surveyItem = await surveyTargetAudience(queryExecutor, '1');
    expect(surveyItem).toBeFalsy();
  });
  test('Test survey audience not null', async () => {
    const surveyItem = await surveyTargetAudience(
      queryExecutor,
      'usm35873f5f3c09e48683b564143d52f18b'
    );
    expect(surveyItem).toBeTruthy();
  });
});
