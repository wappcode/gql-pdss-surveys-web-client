import { describe, expect, test } from 'vitest';
import { queryExecutor } from './query-executor';
import {
  createSurveyQuestionOption,
  deleteSurveyQuestionOption,
  getSurveyQuestionOption,
  getSurveyQuestionOptions,
  updateSurveyQuestionOption
} from '../src/lib/survey-question-option.fn';
import { SurveyQuestionOptionInput } from '../src/models';

describe('Survey option Functions Test', async () => {
  test('Test survey connection', async () => {
    const connection = await getSurveyQuestionOptions(queryExecutor);
    expect(connection.totalCount).toBeGreaterThan(0);
  });

  test('Test survey option null', async () => {
    const surveyItem = await getSurveyQuestionOption(queryExecutor, '0');
    expect(surveyItem).toBeFalsy();
  });
  test('Test survey option not null', async () => {
    const surveyItem = await getSurveyQuestionOption(queryExecutor, '1');
    expect(surveyItem).toBeTruthy();
  });
  test('Test survey question option crud', async () => {
    const input: SurveyQuestionOptionInput = {
      title: 'New Survey Section option Input',
      question: 'qvcafc7b276826d788ccdf62dd08a5b8344',
      value: 'a',
      order: 13
    };

    let questionOption;
    try {
      questionOption = await createSurveyQuestionOption(queryExecutor, input);
    } catch (e) {
      console.log(e);
    }

    expect(questionOption.id).toBeTruthy();
    const newTitle = 'Survey question option updated';
    let questionOptionUpdated;
    try {
      questionOptionUpdated = await updateSurveyQuestionOption(queryExecutor, questionOption.id, {
        title: newTitle
      });
    } catch (e) {
      console.log(e);
    }
    expect(questionOptionUpdated.title).toEqual(newTitle);
    let deleted;
    try {
      deleted = await deleteSurveyQuestionOption(queryExecutor, questionOption.id);
    } catch (e) {
      console.log(e);
    }
    expect(deleted).toEqual(true);
  });
});
