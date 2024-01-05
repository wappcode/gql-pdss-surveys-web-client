import { describe, expect, test } from 'vitest';
import { queryExecutor } from './query-executor';
import {
  getSurveyTargetAudiences,
  getSurveyTargetAudience,
  createSurveyTargetAudience,
  updateSurveyTargetAudience,
  deleteSurveyTargetAudience,
  buildSurveyTargetAudience
} from '../src/lib/survey-target-audience.fn';
import { BuildSurveyTargetAudienceInput, SurveyTargetAudienceInput } from '../src/models';

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

  test('Build Survey Target Audience', async () => {
    const title = 'New Survey Target Audience' + Math.random();
    const input: BuildSurveyTargetAudienceInput = {
      title,
      survey: 'gqt03d4086ab23209f12247449ec693aa05',
      welcome: {
        type: 'HTML',
        body: '<h1>New Survey Target Audience Bienvenida</h1>',
        presentation: {
          type: 'PRESENTATION',
          value: '{"className":"welcome-class"}'
        }
      },
      farewell: {
        type: 'HTML',
        body: '<h1>New Survey Target Audience Despedida</h1>',
        presentation: {
          type: 'PRESENTATION',
          value: '{"className":"farewell-class"}'
        }
      },
      presentation: {
        type: 'PRESENTATION',
        value: '{"className":"audience-class"}'
      }
    };
    let audience;
    try {
      audience = await buildSurveyTargetAudience(queryExecutor, input);
    } catch (e) {
      console.log(e);
    }
    expect(audience.id).toBeTruthy();
    expect(audience.welcome.id).toBeTruthy();
    expect(audience.farewell.id).toBeTruthy();
    expect(audience.presentation.id).toBeTruthy();
    expect(audience.welcome.presentation.id).toBeTruthy();
    expect(audience.farewell.presentation.id).toBeTruthy();
    const newTitle = 'New Title survey target audience' + Math.random();
    const inputUpdated = { ...input, title: newTitle, id: audience.id, farewell: undefined };
    let audienceUpdated;
    try {
      audienceUpdated = await buildSurveyTargetAudience(queryExecutor, inputUpdated);
    } catch (e) {
      console.log(e);
    }
    expect(audienceUpdated.id).toBeTruthy();
    expect(audienceUpdated.title).toEqual(newTitle);
    expect(audienceUpdated.welcome.id).toBeTruthy();
    expect(audienceUpdated.farewell?.id).toBeFalsy();
  });
});
