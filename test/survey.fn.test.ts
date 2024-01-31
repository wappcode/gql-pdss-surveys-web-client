import { describe, expect, test } from 'vitest';
import {
  buildSuvey,
  createSurvey,
  deleteSurvey,
  getSurvey,
  getSurveys,
  updateSurvey
} from '../src/lib/survey.fn';
import { BuildSurveyInput, SurveyInput } from '../src/models';
import { queryExecutor } from './query-executor';

describe('Survey Functions Test', async () => {
  test('Test survey connection', async () => {
    const connection = await getSurveys(queryExecutor);
    expect(connection.totalCount).toBeGreaterThan(0);
  });

  test('Test survey null', async () => {
    const surveyItem = await getSurvey(queryExecutor, '1');
    expect(surveyItem).toBeFalsy();
  });
  test('Test survey not null', async () => {
    const surveyItem = await getSurvey(queryExecutor, 'gqt03d4086ab23209f12247449ec693aa05');
    expect(surveyItem).toBeTruthy();
  });
  test('Survey Crud', async () => {
    const input: SurveyInput = {
      title: 'New Survey',
      active: true
    };

    const survey = await createSurvey(queryExecutor, input);
    expect(survey?.id).toBeTruthy();
    const id = survey.id;
    const newTitle = 'Updated Survey';
    const surveyUpdated = await updateSurvey(queryExecutor, id, { title: newTitle, active: false });
    expect(surveyUpdated.title).toEqual(newTitle);
    const deleted = await deleteSurvey(queryExecutor, id);
    expect(deleted).toEqual(true);
  });
  test('Build Survey', async () => {
    const input: BuildSurveyInput = {
      title: 'Survey test 1',
      active: true,
      sections: [
        {
          title: 'Section test 1',
          content: {
            type: 'HTML',
            body: '<h1>Hola mundo</h1>',
            presentation: {
              type: 'PRESENTATION',
              value: JSON.stringify({ className: 'section-content-title' })
            }
          },
          presentation: {
            type: 'PRESENTATION',
            value: JSON.stringify({ className: 'section-presentation' })
          },
          order: 1,
          hidden: false,
          items: [
            {
              type: 'CONTENT',

              order: 1,
              content: {
                type: 'HTML',
                body: '<h2>Section Item</h2>',
                presentation: {
                  type: 'PRESENTATION',
                  value: JSON.stringify({ className: 'item content presentation' })
                }
              },

              hidden: false
            },
            {
              type: 'QUESTION',
              order: 2,
              question: {
                title: 'Question Section 1',
                code: 'Q01',
                type: 'SHORT_TEXT',
                required: true,
                content: {
                  body: '<h1>Question Content</h1>',
                  type: 'HTML',
                  presentation: {
                    type: 'PRESENTATION',
                    value: JSON.stringify({ className: 'question content presentation' })
                  }
                },
                presentation: {
                  type: 'PRESENTATION',
                  value: JSON.stringify({ className: 'question presentation' })
                },
                answerScore: {
                  type: 'ANSWER_SCORE',
                  value: JSON.stringify([{ value: 'valuex', score: 1 }])
                },
                validators: {
                  type: 'VALIDATOR',
                  value: JSON.stringify([{ type: 'regex', pattern: 'xxx' }])
                },
                hint: {
                  body: '<h1>Hint body</h1>',
                  type: 'HTML',
                  presentation: {
                    type: 'PRESENTATION',
                    value: JSON.stringify({ className: ' question hint presentation' })
                  }
                }
              },
              hidden: false
            }
          ]
        }
      ]
    };

    let surveyItem;
    try {
      surveyItem = await buildSuvey(queryExecutor, input);
    } catch (e) {
      const inputstr = JSON.stringify(input);
      console.log(e, inputstr);
    }
    expect(surveyItem.id).toBeTruthy();
    expect(surveyItem.sections[0].content?.id).toBeTruthy();
    expect(surveyItem.sections[0].content?.presentation?.id).toBeTruthy();
    expect(surveyItem.sections[0].presentation?.id).toBeTruthy();
    expect(surveyItem.sections[0].items[0].content?.id).toBeTruthy();
    expect(surveyItem.sections[0].items[1].question?.id).toBeTruthy();

    expect(typeof surveyItem.sections[0].content?.presentation.value).toEqual('object');
    expect(typeof surveyItem.sections[0].presentation?.value).toEqual('object');
    expect(typeof surveyItem.sections[0].items[0].content?.presentation?.value).toEqual('object');
    expect(typeof surveyItem.sections[0].items[1].question?.presentation?.value).toEqual('object');
    expect(typeof surveyItem.sections[0].items[1].question?.content?.presentation?.value).toEqual(
      'object'
    );
    expect(typeof surveyItem.sections[0].items[1].question?.hint?.presentation?.value).toEqual(
      'object'
    );
    expect(typeof surveyItem.sections[0].items[1].question?.answerScore?.value).toEqual('object');
    expect(typeof surveyItem.sections[0].items[1].question?.validators?.value).toEqual('object');

    const id = surveyItem.id;
    await updateSurvey(queryExecutor, id, { active: false });
    const hasBeenDeleted = await deleteSurvey(queryExecutor, id);
    expect(hasBeenDeleted).toBeTruthy();
    return true;
  });
});
