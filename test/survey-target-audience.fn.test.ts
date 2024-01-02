import { describe, expect, test } from 'vitest';
import { queryExecutor } from './query-executor';
import {
  getSurveyTargetAudiences,
  getSurveyTargetAudience,
  createSurveyTargetAudience,
  updateSurveyTargetAudience,
  deleteSurveyTargetAudience
} from '../src/lib/survey-target-audience.fn';
import { SurveyTargetAudienceInput } from '../src/models';

describe('Survey Target Audience Functions Test', async () => {
  test('Test survey connection', async () => {
    const connection = await getSurveyTargetAudiences(queryExecutor);
    expect(connection.totalCount).toBeGreaterThan(0);
  });

  test('Test survey audience null', async () => {
    const surveyItem = await getSurveyTargetAudience(queryExecutor, '1');
    expect(surveyItem).toBeFalsy();
  });
  test('Test survey audience not null', async () => {
    const surveyItem = await getSurveyTargetAudience(
      queryExecutor,
      'usm35873f5f3c09e48683b564143d52f18b'
    );
    expect(surveyItem).toBeTruthy();
  });

  test('Test survey audience crud', async () => {
    const input: SurveyTargetAudienceInput = {
      title: 'Nueva audiencia',
      survey: 'gqt03d4086ab23209f12247449ec693aa05'
    };

    const audience = await createSurveyTargetAudience(queryExecutor, input);
    expect(audience.id).toBeTruthy();
    const newTitle = 'Audiencia Actualizada';
    const audienceUpdated = await updateSurveyTargetAudience(queryExecutor, audience.id, {
      title: newTitle
    });
    expect(audienceUpdated.title).toEqual(newTitle);

    const deleted = await deleteSurveyTargetAudience(queryExecutor, audience.id);
    expect(deleted).toEqual(true);
  });
});
