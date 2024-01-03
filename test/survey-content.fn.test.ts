import { describe, expect, test } from 'vitest';
import { queryExecutor } from './query-executor';
import { getSurveyContent, getSurveyContents } from '../src/lib/survey-content.fn';
import { SurveyContentInput } from '../src/models';
import {
  createSurveyContent,
  updateSurveyContent,
  deleteSurveyContent
} from '../src/lib/survey-content.fn';

describe('Survey content Functions Test', async () => {
  test('Test survey connection', async () => {
    const connection = await getSurveyContents(queryExecutor);
    expect(connection.totalCount).toBeGreaterThan(0);
  });

  test('Test survey content null', async () => {
    const surveyItem = await getSurveyContent(queryExecutor, '0');
    expect(surveyItem).toBeFalsy();
  });
  test('Test survey content not null', async () => {
    const surveyItem = await getSurveyContent(queryExecutor, '1');
    expect(surveyItem).toBeTruthy();
  });
  test('Test survey content crud', async () => {
    const input: SurveyContentInput = {
      type: 'HTML',
      body: '<h1>hola mundo</h1>'
    };

    let content;
    try {
      content = await createSurveyContent(queryExecutor, input);
    } catch (e) {
      console.log(e);
    }

    expect(content.id).toBeTruthy();
    const newBody = '<h1>Hola mundo actualizado</h1>';
    let contentUpdated;
    try {
      contentUpdated = await updateSurveyContent(queryExecutor, content.id, {
        body: newBody
      });
    } catch (e) {
      console.log(e);
    }
    expect(contentUpdated.body).toEqual(newBody);
    let deleted;
    try {
      deleted = await deleteSurveyContent(queryExecutor, content.id);
    } catch (e) {
      console.log(e);
    }
    expect(deleted).toEqual(true);
  });
});
