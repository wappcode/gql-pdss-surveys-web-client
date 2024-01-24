import { describe, expect, test } from 'vitest';
import { queryExecutor } from './query-executor';
import {
  getSurveyQuestions,
  getSurveyQuestion,
  createSurveyQuestion,
  updateSurveyQuestion,
  deleteSurveyQuestion,
  buildSurveyQuestion
} from '../src/lib/survey-question.fn';
import { BuildSurveyQuestionInput, SurveyQuestion, SurveyQuestionInput } from '../src/models';

describe('Survey question Functions Test', async () => {
  test('Test survey connection', async () => {
    const connection = await getSurveyQuestions(queryExecutor);
    expect(connection.totalCount).toBeGreaterThan(0);
  });

  test('Test survey question null', async () => {
    const surveyItem = await getSurveyQuestion(queryExecutor, '0');
    expect(surveyItem).toBeFalsy();
  });
  test('Test survey question not null', async () => {
    const surveyItem = await getSurveyQuestion(
      queryExecutor,
      'qvcafc7b276826d788ccdf62dd08a5b8344'
    );
    expect(surveyItem).toBeTruthy();
  });
  test('Test survey question crud', async () => {
    const input: SurveyQuestionInput = {
      title: 'New Survey Section Input',
      code: 'Q0' + Math.random(),
      survey: 'gqt03d4086ab23209f12247449ec693aa05',
      type: 'SHORT_TEXT',
      required: true
    };

    const question = await createSurveyQuestion(queryExecutor, input);
    expect(question.id).toBeTruthy();
    const newTitle = 'Survey Section updated';
    const questionUpdated = await updateSurveyQuestion(queryExecutor, question.id, {
      title: newTitle
    });
    expect(questionUpdated.title).toEqual(newTitle);
    const deleted = await deleteSurveyQuestion(queryExecutor, question.id);
    expect(deleted).toEqual(true);
  });

  test('Test build survey question', async () => {
    const input: BuildSurveyQuestionInput = {
      survey: 'gqt03d4086ab23209f12247449ec693aa05',
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
    };
    console.log(JSON.stringify(input));
    let question: SurveyQuestion | undefined;
    try {
      question = await buildSurveyQuestion(queryExecutor, input);
    } catch (e) {
      console.log(e);
    }
    expect(question?.id).toBeTruthy();
    expect(question?.presentation?.id).toBeTruthy();
    expect(question?.answerScore?.id).toBeTruthy();
    expect(question?.content?.id).toBeTruthy();
    expect(question?.validators?.id).toBeTruthy();

    const newTitle = 'new question title' + Math.random();
    let updatedQuestion: SurveyQuestion | undefined;

    try {
      updatedQuestion = await buildSurveyQuestion(queryExecutor, {
        ...input,
        title: newTitle,
        id: question!.id
      });
    } catch (e) {
      console.log(e);
    }
    expect(updatedQuestion?.title).toEqual(newTitle);
    expect(updatedQuestion?.presentation?.id).toBeTruthy();
    expect(updatedQuestion?.answerScore?.id).toBeTruthy();
    expect(updatedQuestion?.content?.id).toBeTruthy();
    expect(updatedQuestion?.validators?.id).toBeTruthy();
  });
});
