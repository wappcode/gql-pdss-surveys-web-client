import { describe, expect, test } from 'vitest';
import { queryExecutor } from './query-executor';
import {
  createSurveySectionItem,
  deleteSurveySectionItem,
  getSurveySectionItem,
  getSurveySectionItems,
  updateSurveySectionItem
} from '../src/lib/survey-section-item.fn';
import { SurveyQuestionInput, SurveySectionItemInput } from '../src/models';
import { createSurveyQuestion } from '../src/lib/survey-question.fn';

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
  test('Test survey section item crud', async () => {
    const random = Math.random();
    const questionInput: SurveyQuestionInput = {
      code: 'QTEST' + random,
      required: true,
      survey: 'gqt03d4086ab23209f12247449ec693aa05',
      title: 'Question Test',
      type: 'SHORT_TEXT'
    };
    const question = await createSurveyQuestion(queryExecutor, questionInput);
    const input: SurveySectionItemInput = {
      order: 1,
      section: 'cbr2ba9a868d6bbc3a9daa22703a7e54af4',
      type: 'QUESTION',
      question: question.id,
      hidden: false
    };
    let item;
    try {
      item = await createSurveySectionItem(queryExecutor, input);
    } catch (e) {
      console.log(e);
    }
    expect(item.id).toBeTruthy();
    const newOrder = 2;
    let itemUpdated;
    try {
      itemUpdated = await updateSurveySectionItem(queryExecutor, item.id, {
        order: newOrder
      });
    } catch (e) {
      console.log(e);
    }
    expect(itemUpdated.order).toEqual(newOrder);
    let deleted;
    try {
      deleted = await deleteSurveySectionItem(queryExecutor, item.id);
    } catch (e) {
      console.log(e);
    }
    expect(deleted).toEqual(true);
  });
});
