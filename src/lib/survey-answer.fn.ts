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
import { SurveyAnswer, SurveyAnswerInput } from '../models';
import { standardizeCreateAndUpdate } from './standardize-dates.fn';

export const standardizeSurveyAnswer = <T>(surveyAnswer: SurveyAnswer<T>): SurveyAnswer<T> => {
  const standarDates = standardizeCreateAndUpdate(surveyAnswer);
  let value;
  try {
    value =
      typeof surveyAnswer.value == 'string' ? JSON.parse(surveyAnswer.value) : surveyAnswer.value;
  } catch (e) {
    value = surveyAnswer.value;
  }
  return { ...standarDates, value };
};

export const getSurveyAnswerFragment = (): GQLQueryObject => {
  const fragment = gqlparse`
    
    fragment fragmentSurveyAnswer on SurveyAnswer {
        id
        value
        question{
          id
          code
        }
        score
        scorePercent
        session{
          id
          ownerCode    
        }
        created
        updated
        
      }
    `;

  return fragment;
};

export const getSurveyAnswers = (
  executor: QueryExecutor,
  input?: GQLConnectionInput,
  fragment?: GQLQueryData
) => {
  const finalFragment = fragment ? queryDataToQueryObject(fragment) : getSurveyAnswerFragment();

  const query = gqlparse`
  
  query QuerySurveyAnswerConnection($input: ConnectionInput){
    connection: getSurveyAnswers(input:$input){
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
  return executor<{ connection: GQLConnection<SurveyAnswer> }>(query, { input })
    .then(throwGQLErrors)
    .then((result) => result.data.connection)
    .then(mapConnectionNodesF(standardizeSurveyAnswer));
};

export const getSurveyAnswer = (
  executor: QueryExecutor,
  id: string,
  fragment?: GQLQueryData
): Promise<SurveyAnswer | null> => {
  const finalFragment = fragment ? queryDataToQueryObject(fragment) : getSurveyAnswerFragment();

  const query = gqlparse`
    query QuerySurveyAnswer($id: ID!){
        answer: getSurveyAnswer(id:$id){
       
            ...${finalFragment.operationName}
          
        }
      }
      ${finalFragment.query}
    `;
  return executor<{ answer: SurveyAnswer | null }>(query, { id })
    .then(throwGQLErrors)
    .then((result) => result.data.answer)
    .then((answer) => (answer ? standardizeSurveyAnswer(answer) : answer));
};

export const createSurveyAnswer = <T>(
  executor: QueryExecutor,
  input: SurveyAnswerInput,
  fragment?: GQLQueryData
): Promise<SurveyAnswer<T>> => {
  const finalFragment = fragment ? queryDataToQueryObject(fragment) : getSurveyAnswerFragment();
  const query = `
  mutation MutationCreateSurveyAnswer($input: SurveyAnswerInput!){
    questionOption:createSurveyAnswer(input: $input){
      ...${finalFragment.operationName}
    }
  }
  ${finalFragment.query}
  `;
  return executor<{ questionOption: SurveyAnswer<T> }>(query, { input })
    .then(throwGQLErrors)
    .then((result) => result.data.questionOption)
    .then(standardizeSurveyAnswer);
};
export const updateSurveyAnswer = <T>(
  executor: QueryExecutor,
  id: string,
  input: Partial<SurveyAnswerInput>,
  fragment?: GQLQueryData
): Promise<SurveyAnswer<T>> => {
  const finalFragment = fragment ? queryDataToQueryObject(fragment) : getSurveyAnswerFragment();
  const query = `
  mutation MutationUpdateSurveyAnswer($id:ID!,$input: SurveyAnswerPartialInput!){
    questionOption:updateSurveyAnswer(id: $id,input: $input){
      ...${finalFragment.operationName}
    }
  }
  ${finalFragment.query}
  `;
  return executor<{ questionOption: SurveyAnswer<T> }>(query, { id, input })
    .then(throwGQLErrors)
    .then((result) => result.data.questionOption)
    .then(standardizeSurveyAnswer);
};
export const deleteSurveyAnswer = (executor: QueryExecutor, id: string): Promise<boolean> => {
  const query = `
  mutation MutationDeleteSurveyAnswer($id:ID!){
    successful:deleteSurveyAnswer(id: $id)
  }
  `;
  return executor<{ successful: boolean }>(query, { id })
    .then(throwGQLErrors)
    .then((result) => result.data.successful);
};
