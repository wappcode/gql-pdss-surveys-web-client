import {
  GQLConnection,
  GQLConnectionInput,
  GQLQueryData,
  GQLQueryObject,
  QueryExecutor,
  gqlparse,
  mapConnectionNodesF,
  queryDataToQueryObject,
  throwGQLErrors
} from 'graphql-client-utilities';
import { SurveyAnswerSession } from '../models';
import { standardizeCreateAndUpdate } from './standardize-dates.fn';
import { standardizeSurveyAnswer } from './survey-answer.fn';

export const standardizeSurveyAnswerSession = (
  session: SurveyAnswerSession
): SurveyAnswerSession => {
  const standarDates = standardizeCreateAndUpdate(session);

  let { answers } = session;
  if (Array.isArray(answers)) {
    answers = answers.map(standardizeSurveyAnswer);
  }
  return { ...standarDates, answers };
};

export const getSurveyAnswerSessionFragment = (): GQLQueryObject => {
  const fragment = gqlparse`
  fragment fragmentSurveyAnswerSession on SurveyAnswerSession{
    id
     name
     username
     ownerCode
     score
     scorePercent
     targetAudience{
       id
     }
     survey{
       id
     }
     completed
     created
     updated
   }
    `;
  return fragment;
};
export const getSurveyAnswerSessionAndAnswersFragment = (): GQLQueryObject => {
  const fragment = gqlparse`
  fragment fragmentSurveyAnswerSessionAndAnswers on SurveyAnswerSession{
    id
     name
     username
     ownerCode
     score
     scorePercent
     targetAudience{
       id
     }
     survey{
       id
     }
     answers{
       id
       value
       question{
         id
         code
       }
       score
       scorePercent
       created
       updated
     }
     completed
     created
     updated
   }    `;
  return fragment;
};

export const surveyAnswerSessionConnection = (
  executor: QueryExecutor,
  input?: GQLConnectionInput,
  fragment?: GQLQueryData
): Promise<GQLConnection<SurveyAnswerSession>> => {
  const finalFragment = fragment
    ? queryDataToQueryObject(fragment)
    : getSurveyAnswerSessionFragment();
  const query = gqlparse`
  query QuerySurveyAnswerSessionConnection($input: ConnectionInput){
    connection: surveyAnswerSessionConnection(input: $input){
      totalCount
      pageInfo{
        hasPreviousPage
        hasNextPage
        startCursor
        endCursor
      }
      edges{
        cursor
        node{
          ...${finalFragment.operationName} 
        }
      }
    }
  }
  ${finalFragment.query}
    `;
  return executor<{ connection: GQLConnection<SurveyAnswerSession> }>(query, { input })
    .then(throwGQLErrors)
    .then((result) => result.data.connection)
    .then(mapConnectionNodesF(standardizeSurveyAnswerSession));
};

export const surveyAnswerSession = (
  executor: QueryExecutor,
  id: string,
  fragment?: GQLQueryData
): Promise<SurveyAnswerSession | null> => {
  const finalFragment = fragment
    ? queryDataToQueryObject(fragment)
    : getSurveyAnswerSessionAndAnswersFragment();
  const query = gqlparse`
  query QuerySurveyAnswerSession($id: ID!){
    session: surveyAnswerSession(id: $id){
     ...${finalFragment.operationName}
    }
  }
  ${finalFragment.query}
    `;
  return executor<{ session: SurveyAnswerSession | null }>(query, { id })
    .then(throwGQLErrors)
    .then((result) => result.data.session)
    .then((session) => (session ? standardizeSurveyAnswerSession(session) : null));
};

export const findSurveyAnswerSessionByUsernameAndPassword = (
  executor: QueryExecutor,
  targetAudience: string,
  username: string,
  password: string,
  fragment?: GQLQueryData
) => {
  const finalFragment = fragment
    ? queryDataToQueryObject(fragment)
    : getSurveyAnswerSessionAndAnswersFragment();
  const query = gqlparse`
    query QueryFindSurveyAnswerSessionByUsernameAndPassword(
        $targetAudience: ID! 
        $username: String!
        $password: String!
      ){
        session: findSurveyAnswerSessionByUsernameAndPassword(
          targetAudience: $targetAudience,
          username: $username,
          password: $password
        ){
          ...${finalFragment.operationName}
        }
      }
      ${finalFragment.query}
    
    `;
  return executor<{ session: SurveyAnswerSession | null }>(query, {
    targetAudience,
    username,
    password
  })
    .then(throwGQLErrors)
    .then((result) => result.data.session)
    .then((session) => (session ? standardizeSurveyAnswerSession(session) : null));
};
export const findSurveyAnswerSessionByOwnerCode = (
  executor: QueryExecutor,
  targetAudience: string,
  ownerCode: string,
  fragment?: GQLQueryData
) => {
  const finalFragment = fragment
    ? queryDataToQueryObject(fragment)
    : getSurveyAnswerSessionAndAnswersFragment();
  const query = gqlparse`
  query QueryFindSurveyAnswerSessionByOwnerCode (
    $targetAudience: ID! 
    $ownerCode: String!
    ){  
      session:findSurveyAnswerSessionByOwnerCode(
        targetAudience: $targetAudience, 
        ownerCode:$ownerCode
        ){
        ...${finalFragment.operationName}
      }
  }
  ${finalFragment.query}
    
    `;
  return executor<{ session: SurveyAnswerSession | null }>(query, {
    targetAudience,
    ownerCode
  })
    .then(throwGQLErrors)
    .then((result) => result.data.session)
    .then((session) => (session ? standardizeSurveyAnswerSession(session) : null));
};
