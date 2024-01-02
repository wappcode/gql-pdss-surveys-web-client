import { describe, expect, test } from 'vitest';
import { queryExecutor } from './query-executor';
import { getSurveySectionItem, getSurveySectionItems } from '../src/lib/survey-section-item.fn';

describe('Survey section item Functions Test', async () => {
  test('Test survey connection', async () => {
    let connection;
    try {
      connection = await getSurveySectionItems(queryExecutor);
    } catch (e) {
      console.log(e);
    }
    expect(connection.totalCount).toBeGreaterThan(0);
  });

  test('Test survey section item null', async () => {
    const surveyItem = await getSurveySectionItem(queryExecutor, '0');
    expect(surveyItem).toBeFalsy();
  });
  test('Test survey section item not null', async () => {
    const surveyItem = await getSurveySectionItem(
      queryExecutor,
      'brb95af5deb6e8ce2c53e43d94f46dd719e'
    );
    expect(surveyItem).toBeTruthy();
  });
});
