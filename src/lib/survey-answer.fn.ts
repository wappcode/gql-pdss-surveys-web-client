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
import { SurveyAnswer } from '../models';
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

export const surveyAnswerConnection = (
  executor: QueryExecutor,
  input?: GQLConnectionInput,
  fragment?: GQLQueryData
) => {
  const finalFragment = fragment ? queryDataToQueryObject(fragment) : getSurveyAnswerFragment();

  const query = gqlparse`
  
  query QuerySurveyAnswerConnection($input: ConnectionInput){
    connection: surveyAnswerConnection(input:$input){
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

export const surveyAnswer = (
  executor: QueryExecutor,
  id: string,
  fragment?: GQLQueryData
): Promise<SurveyAnswer | null> => {
  const finalFragment = fragment ? queryDataToQueryObject(fragment) : getSurveyAnswerFragment();

  const query = gqlparse`
    query QuerySurveyAnswer($id: ID!){
        answer: surveyAnswer(id:$id){
       
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
