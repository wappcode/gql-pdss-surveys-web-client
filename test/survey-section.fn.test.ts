import { describe, expect, test } from 'vitest';
import { queryExecutor } from './query-executor';
import {
  buildSurveySection,
  createSurveySection,
  deleteSurveySection,
  getSurveySection,
  getSurveySections,
  updateSurveySection
} from '../src/lib/survey-section.fn';
import { BuildSurveySectionInput, SurveySection, SurveySectionInput } from '../src/models';

describe('Survey section Functions Test', async () => {
  test('Test survey connection', async () => {
    const connection = await getSurveySections(queryExecutor);
    expect(connection.totalCount).toBeGreaterThan(0);
  });

  test('Test survey section null', async () => {
    const surveyItem = await getSurveySection(queryExecutor, '0');
    expect(surveyItem).toBeFalsy();
  });
  test('Test survey section not null', async () => {
    const surveyItem = await getSurveySection(queryExecutor, 'cbr2ba9a868d6bbc3a9daa22703a7e54af4');
    expect(surveyItem).toBeTruthy();
  });
  test('Test survey section crud', async () => {
    const input: SurveySectionInput = {
      title: 'New Survey Section Input',
      order: 1,
      hidden: false,
      survey: 'gqt03d4086ab23209f12247449ec693aa05'
    };

    const section = await createSurveySection(queryExecutor, input);
    expect(section.id).toBeTruthy();
    const newTitle = 'Survey Section updated';
    const sectionUpdated = await updateSurveySection(queryExecutor, section.id, {
      title: newTitle
    });
    expect(sectionUpdated.title).toEqual(newTitle);
    const deleted = await deleteSurveySection(queryExecutor, section.id);
    expect(deleted).toEqual(true);
  });

  test('Test Build Survey Section', async () => {
    const input: BuildSurveySectionInput = {
      survey: 'gqt03d4086ab23209f12247449ec693aa05',
      title: 'Section title',
      content: {
        type: 'HTML',
        body: '<h1>Section Body</h1>'
      },
      presentation: {
        value: '{"className":"presentation-class"}',
        type: 'PRESENTATION'
      },
      order: 100,
      hidden: false,
      items: [
        {
          type: 'QUESTION',
          order: 2,
          conditions: {
            type: 'CONDITION',
            value: '[{"a":1}]'
          },
          hidden: false,
          question: {
            title: 'Question title',
            code: 'Q' + Math.random(),
            type: 'SHORT_TEXT',
            required: true,
            other: false,
            hint: {
              body: 'Question Hint',
              type: 'TEXT'
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
        },
        {
          type: 'CONTENT',
          order: 1,
          conditions: {
            type: 'CONDITION',
            value: '[{"a":1}]'
          },
          hidden: false,
          content: {
            type: 'HTML',
            body: '<h1>Section item Body</h1>'
          }
        }
      ]
    };

    let section: SurveySection | undefined;
    try {
      section = await buildSurveySection(queryExecutor, input);
    } catch (e) {
      console.log(e);
    }
    expect(section?.id).toBeTruthy();
    expect(section?.items.length).toBeGreaterThan(0);
    expect(section?.content?.id).toBeTruthy();
    expect(section?.presentation?.id).toBeTruthy();
    const newTitle = 'Section Title updated';
    let sectionUpdated;
    const updatedInput: BuildSurveySectionInput = {
      ...input,
      id: section?.id,
      title: newTitle,
      content: undefined,
      presentation: undefined
    };
    try {
      sectionUpdated = await buildSurveySection(queryExecutor, updatedInput);
    } catch (e) {
      console.log(e);
    }
    expect(sectionUpdated.id).toEqual(section?.id);
    expect(sectionUpdated.title).toEqual(newTitle);
    expect(section?.items.length).toBeGreaterThan(0);
    expect(sectionUpdated.content?.id).toBeFalsy();
    expect(sectionUpdated.presentation?.id).toBeFalsy();
  });
});
