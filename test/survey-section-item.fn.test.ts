import { describe, expect, test } from 'vitest';
import { queryExecutor } from './query-executor';
import {
  buildSurveySectionItem,
  createSurveySectionItem,
  deleteSurveySectionItem,
  getSurveySectionItem,
  getSurveySectionItems,
  updateSurveySectionItem
} from '../src/lib/survey-section-item.fn';
import {
  BuildSurveySectionItemInput,
  SurveyQuestionInput,
  SurveySectionItemInput
} from '../src/models';
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

  test('Test build survey section item', async () => {
    const input: BuildSurveySectionItemInput = {
      type: 'QUESTION',
      order: 2,
      conditions: {
        type: 'CONDITION',
        value: '[{"a":1}]'
      },
      hidden: false,
      section: 'cbr2ba9a868d6bbc3a9daa22703a7e54af4',
      question: {
        title: 'Question title',
        code: 'Q' + Math.random(),
        type: 'SHORT_TEXT',
        required: true,
        other: false,
        hint: {
          body: 'Question Hint',
          type: 'TEXT',
          presentation: {
            value: '{"className":"question-hint-class"}',
            type: 'PRESENTATION'
          }
        },
        content: {
          type: 'HTML',
          body: '<h1>Question Body</h1>'
        },
        presentation: {
          value: '{"className":"question-class"}',
          type: 'PRESENTATION'
        },
        validators: {
          value: '[{"validador":"a"}]',
          type: 'VALIDATOR'
        },
        answerScore: {
          value: '[{"score":1}]',
          type: 'ANSWER_SCORE'
        },
        score: 10.4,
        options: [
          {
            title: 'Option 1',
            value: '01',
            order: 1,
            content: {
              type: 'HTML',
              body: '<h1>Question Option Body</h1>'
            },
            presentation: {
              value: '{"className":"question-option-class"}',
              type: 'PRESENTATION'
            }
          },
          {
            title: 'Option 2',
            value: '02',
            order: 2,
            content: {
              type: 'HTML',
              body: '<h1>Question Option 2 Body</h1>'
            },
            presentation: {
              value: '{"className":"question-option-class"}',
              type: 'PRESENTATION'
            }
          }
        ]
      }
    };

    let item;
    try {
      item = await buildSurveySectionItem(queryExecutor, input);
    } catch (e) {
      console.log(e);
    }
    expect(item.id).toBeTruthy();
    expect(item.question.id).toBeTruthy();

    const newOrder = 3;
    let itemUpdated;

    try {
      itemUpdated = await buildSurveySectionItem(queryExecutor, {
        ...input,
        id: item.id,
        order: newOrder
      });
    } catch (e) {
      console.log(e);
    }
    expect(itemUpdated.order).toEqual(newOrder);
  });
});
