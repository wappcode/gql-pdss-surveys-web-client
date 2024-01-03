import { describe, expect, test } from 'vitest';
import { queryExecutor } from './query-executor';
import {
  getSurveyQuestions,
  getSurveyQuestion,
  createSurveyQuestion,
  updateSurveyQuestion,
  deleteSurveyQuestion
} from '../src/lib/survey-question.fn';
import { SurveyQuestionInput } from '../src/models';

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
});
