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
import { SurveyAnswerSession, SurveyAnswerSessionInput } from '../models';
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

export const getSurveyAnswerSessions = (
  executor: QueryExecutor,
  input?: GQLConnectionInput,
  fragment?: GQLQueryData
): Promise<GQLConnection<SurveyAnswerSession>> => {
  const finalFragment = fragment
    ? queryDataToQueryObject(fragment)
    : getSurveyAnswerSessionFragment();
  const query = gqlparse`
  query QuerySurveyAnswerSessionConnection($input: ConnectionInput){
    connection: getSurveyAnswerSessions(input: $input){
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

export const getSurveyAnswerSession = (
  executor: QueryExecutor,
  id: string,
  fragment?: GQLQueryData
): Promise<SurveyAnswerSession | null> => {
  const finalFragment = fragment
    ? queryDataToQueryObject(fragment)
    : getSurveyAnswerSessionAndAnswersFragment();
  const query = gqlparse`
  query QuerySurveyAnswerSession($id: ID!){
    session: getSurveyAnswerSession(id: $id){
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

export const createSurveyAnswerSession = (
  executor: QueryExecutor,
  input: SurveyAnswerSessionInput,
  fragment?: GQLQueryData
): Promise<SurveyAnswerSession> => {
  const finalFragment = fragment
    ? queryDataToQueryObject(fragment)
    : getSurveyAnswerSessionFragment();
  const query = `
  mutation MutationCreateSurveyAnswerSession($input: SurveyAnswerSessionInput!){
    questionOption:createSurveyAnswerSession(input: $input){
      ...${finalFragment.operationName}
    }
  }
  ${finalFragment.query}
  `;
  return executor<{ questionOption: SurveyAnswerSession }>(query, { input })
    .then(throwGQLErrors)
    .then((result) => result.data.questionOption)
    .then((content) => standardizeSurveyAnswerSession(content)!);
};
export const updateSurveyAnswerSession = (
  executor: QueryExecutor,
  id: string,
  input: Partial<SurveyAnswerSessionInput>,
  fragment?: GQLQueryData
): Promise<SurveyAnswerSession> => {
  const finalFragment = fragment
    ? queryDataToQueryObject(fragment)
    : getSurveyAnswerSessionFragment();
  const query = `
  mutation MutationUpdateSurveyAnswerSession($id:ID!,$input: SurveyAnswerSessionPartialInput!){
    questionOption:updateSurveyAnswerSession(id: $id,input: $input){
      ...${finalFragment.operationName}
    }
  }
  ${finalFragment.query}
  `;
  return executor<{ questionOption: SurveyAnswerSession }>(query, { id, input })
    .then(throwGQLErrors)
    .then((result) => result.data.questionOption)
    .then((content) => standardizeSurveyAnswerSession(content)!);
};
export const deleteSurveyAnswerSession = (
  executor: QueryExecutor,
  id: string
): Promise<boolean> => {
  const query = `
  mutation MutationDeleteSurveyAnswerSession($id:ID!){
    successful:deleteSurveyAnswerSession(id: $id)
  }
  `;
  return executor<{ successful: boolean }>(query, { id })
    .then(throwGQLErrors)
    .then((result) => result.data.successful);
};
