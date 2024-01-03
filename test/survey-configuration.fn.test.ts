import { describe, expect, test } from 'vitest';
import { queryExecutor } from './query-executor';
import {
  createSurveyConfiguration,
  deleteSurveyConfiguration,
  getSurveyConfiguration,
  getSurveyConfigurations,
  updateSurveyConfiguration
} from '../src/lib/survey-configuration.fn';
import { SurveyConfigurationInput } from '../src/models';

describe('Survey configuration Functions Test', async () => {
  test('Test survey connection', async () => {
    const connection = await getSurveyConfigurations(queryExecutor);
    expect(connection.totalCount).toBeGreaterThan(0);
  });

  test('Test survey configuration null', async () => {
    const surveyItem = await getSurveyConfiguration(queryExecutor, '0');
    expect(surveyItem).toBeFalsy();
  });
  test('Test survey configuration not null', async () => {
    const surveyItem = await getSurveyConfiguration(queryExecutor, '1');
    expect(surveyItem).toBeTruthy();
  });
  test('Test survey content crud', async () => {
    const value = JSON.stringify({ className: 'mexico' });
    const input: SurveyConfigurationInput = {
      type: 'PRESENTATION',
      value
    };

    let content;
    try {
      content = await createSurveyConfiguration(queryExecutor, input);
    } catch (e) {
      console.log(e);
    }

    expect(content.id).toBeTruthy();
    const newType = 'ANSWER_SCORE';
    let contentUpdated;
    try {
      contentUpdated = await updateSurveyConfiguration(queryExecutor, content.id, {
        type: newType
      });
    } catch (e) {
      console.log(e);
    }
    expect(contentUpdated.type).toEqual(newType);
    let deleted;
    try {
      deleted = await deleteSurveyConfiguration(queryExecutor, content.id);
    } catch (e) {
      console.log(e);
    }
    expect(deleted).toEqual(true);
  });
});
