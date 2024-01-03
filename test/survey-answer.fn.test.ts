import { describe, expect, test } from 'vitest';
import { queryExecutor } from './query-executor';
import {
  createSurveyAnswer,
  deleteSurveyAnswer,
  getSurveyAnswer,
  getSurveyAnswers,
  updateSurveyAnswer
} from '../src/lib/survey-answer.fn';
import { SurveyAnswerInput, SurveyQuestionInput } from '../src/models';
import { createSurveyQuestion } from '../src/lib/survey-question.fn';

describe('Survey Answer Functions Test', async () => {
  test('Test survey connection', async () => {
    const connection = await getSurveyAnswers(queryExecutor);
    expect(connection.totalCount).toBeGreaterThan(0);
  });

  test('Test survey answer null', async () => {
    const surveyItem = await getSurveyAnswer(queryExecutor, '0');
    expect(surveyItem).toBeFalsy();
  });
  test('Test survey answer not null', async () => {
    const surveyItem = await getSurveyAnswer(queryExecutor, '1');
    expect(surveyItem).toBeTruthy();
  });

  test('Test survey content crud', async () => {
    const random = Math.random();
    const questionInput: SurveyQuestionInput = {
      code: 'QTEST' + random,
      required: true,
      survey: 'gqt03d4086ab23209f12247449ec693aa05',
      title: 'Question Test',
      type: 'SHORT_TEXT'
    };
    const question = await createSurveyQuestion(queryExecutor, questionInput);
    const input: SurveyAnswerInput = {
      value: 'a',
      question: question.id,
      session: 'pmie907eeb7a84d9c3cbd9bd7dd34042723'
    };

    let content;
    try {
      content = await createSurveyAnswer(queryExecutor, input);
    } catch (e) {
      console.log(e);
    }

    expect(content.id).toBeTruthy();
    const newValue = 'ANSWER_SCORE';
    let contentUpdated;
    try {
      contentUpdated = await updateSurveyAnswer(queryExecutor, content.id, {
        value: newValue
      });
    } catch (e) {
      console.log(e);
    }
    expect(contentUpdated.value).toEqual(newValue);
    let deleted;
    try {
      deleted = await deleteSurveyAnswer(queryExecutor, content.id);
    } catch (e) {
      console.log(e);
    }
    expect(deleted).toEqual(true);
  });
});
