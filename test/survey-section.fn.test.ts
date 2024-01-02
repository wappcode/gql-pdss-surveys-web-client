import { describe, expect, test } from 'vitest';
import { queryExecutor } from './query-executor';
import {
  createSurveySection,
  deleteSurveySection,
  getSurveySection,
  getSurveySections,
  updateSurveySection
} from '../src/lib/survey-section.fn';
import { SurveySectionInput } from '../src/models';

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
});
