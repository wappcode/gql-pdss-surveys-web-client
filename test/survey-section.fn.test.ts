import { describe, expect, test } from 'vitest';
import { queryExecutor } from './query-executor';
import { surveySection, surveySectionConnection } from '../src/lib/survey-section.fn';

describe('Survey section Functions Test', async () => {
  test('Test survey connection', async () => {
    const connection = await surveySectionConnection(queryExecutor);
    expect(connection.totalCount).toBeGreaterThan(0);
  });

  test('Test survey section null', async () => {
    const surveyItem = await surveySection(queryExecutor, '0');
    expect(surveyItem).toBeFalsy();
  });
  test('Test survey section not null', async () => {
    const surveyItem = await surveySection(queryExecutor, 'cbr2ba9a868d6bbc3a9daa22703a7e54af4');
    expect(surveyItem).toBeTruthy();
  });
});