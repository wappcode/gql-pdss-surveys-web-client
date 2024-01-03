import { describe, expect, test } from 'vitest';
import { queryExecutor } from './query-executor';
import {
  createSurveyAnswerSession,
  deleteSurveyAnswerSession,
  findSurveyAnswerSessionByOwnerCode,
  findSurveyAnswerSessionByUsernameAndPassword,
  getSurveyAnswerSession,
  getSurveyAnswerSessions,
  updateSurveyAnswerSession
} from '../src/lib/survey-answer-session.fn';
import { SurveyAnswerSessionInput } from '../src/models';

describe('Survey answer session item Functions Test', async () => {
  test('Test survey connection', async () => {
    let connection;
    try {
      connection = await getSurveyAnswerSessions(queryExecutor);
    } catch (e) {
      console.log(e);
    }
    expect(connection.totalCount).toBeGreaterThan(0);
  });

  test('Test survey answer session item null', async () => {
    const session = await getSurveyAnswerSession(queryExecutor, '0');
    expect(session).toBeFalsy();
  });
  test('Test survey answer session item not null', async () => {
    const session = await getSurveyAnswerSession(
      queryExecutor,
      'pmie907eeb7a84d9c3cbd9bd7dd34042723'
    );
    expect(session).toBeTruthy();
  });

  test('find answer session by owner code. Invalid code', async () => {
    const session = await findSurveyAnswerSessionByOwnerCode(
      queryExecutor,
      'usm35873f5f3c09e48683b564143d52f18b',
      ''
    );
    expect(session).toBeFalsy();
  });
  test('find answer session by owner code. Invalid targetAudience', async () => {
    const session = await findSurveyAnswerSessionByOwnerCode(
      queryExecutor,
      '',
      'dds20a25cfde285773a34990c9c18ce8539'
    );
    expect(session).toBeFalsy();
  });
  test('find answer session by owner code.', async () => {
    const session = await findSurveyAnswerSessionByOwnerCode(
      queryExecutor,
      'usm35873f5f3c09e48683b564143d52f18b',
      'dds20a25cfde285773a34990c9c18ce8539'
    );
    expect(session).toBeTruthy();
  });
  test('find answer session by username password. empty data', async () => {
    const session = await findSurveyAnswerSessionByUsernameAndPassword(
      queryExecutor,
      'usm35873f5f3c09e48683b564143d52f18b',
      '',
      ''
    );
    expect(session).toBeFalsy();
  });
  test('find answer session by username password. invalid password', async () => {
    const session = await findSurveyAnswerSessionByUsernameAndPassword(
      queryExecutor,
      'usm35873f5f3c09e48683b564143d52f18b',
      'p.lopez',
      ''
    );
    expect(session).toBeFalsy();
  });
  test('find answer session by username password. invalid username', async () => {
    const session = await findSurveyAnswerSessionByUsernameAndPassword(
      queryExecutor,
      'usm35873f5f3c09e48683b564143d52f18b',
      '',
      'demo'
    );
    expect(session).toBeFalsy();
  });
  test('find answer session by username password. valid data', async () => {
    const session = await findSurveyAnswerSessionByUsernameAndPassword(
      queryExecutor,
      'usm35873f5f3c09e48683b564143d52f18b',
      'p.lopez',
      'demo'
    );
    expect(session).toBeTruthy();
  });
  test('Test survey section crud', async () => {
    const input: SurveyAnswerSessionInput = {
      targetAudience: 'usm35873f5f3c09e48683b564143d52f18b',
      completed: false,
      ownerCode: 'abcd' + Math.random(),
      name: 'Pancho lópez'
    };

    let session;
    try {
      session = await createSurveyAnswerSession(queryExecutor, input);
    } catch (e) {
      console.log(e);
    }

    expect(session.id).toBeTruthy();
    const newName = 'Pancho lópez actualizado';
    let sessionUpdated;
    try {
      sessionUpdated = await updateSurveyAnswerSession(queryExecutor, session.id, {
        name: newName
      });
    } catch (e) {
      console.log(e);
    }
    expect(sessionUpdated.name).toEqual(newName);
    let deleted;
    try {
      deleted = await deleteSurveyAnswerSession(queryExecutor, session.id);
    } catch (e) {
      console.log(e);
    }
    expect(deleted).toEqual(true);
  });
});
