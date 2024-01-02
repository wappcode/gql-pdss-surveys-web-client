import {
  GQLConnection,
  GQLConnectionInput,
  GQLQueryData,
  QueryExecutor,
  gqlparse,
  queryDataToQueryObject,
  mapConnectionNodesF,
  throwGQLErrors
} from 'graphql-client-utilities';
import { SurveyTargetAudience, SurveyTargetAudienceInput } from '../models';
import { standardizeSurveyContent } from './survey-content.fn';
import { standardizeSurveyConfiguration } from './survey-configuration.fn';
import { standardizeCreateAndUpdate, standardizeDate } from './standardize-dates.fn';
import { standardizeSurvey } from './survey.fn';

export const standardizeSurveyTargetAudience = <WC, FC, PT>(
  audience: SurveyTargetAudience<WC, FC, PT>
): SurveyTargetAudience<WC, FC, PT> => {
  let { welcome, farewell, presentation, starts, ends, survey } = audience;
  welcome = standardizeSurveyContent<WC>(welcome);
  farewell = standardizeSurveyContent<FC>(farewell);
  presentation = standardizeSurveyConfiguration<PT>(presentation);
  starts = standardizeDate(starts);
  ends = standardizeDate(ends);
  if (survey) {
    survey = standardizeSurvey(survey);
  }
  const standarAudience = standardizeCreateAndUpdate(audience);
  return { ...standarAudience, welcome, farewell, presentation, starts, ends, survey };
};
export const getSurveyTargetAudienceFragment = () => {
  const fragment = gqlparse`
    fragment fragmentSurveyTargetAudience on SurveyTargetAudience {
        id
        title
        starts
        ends
        welcome{
          id
          type
          body
          presentation{
            id
            value
            type
          }
        }
        farewell{
          id
          type
          body
          presentation {
            id
            value
            type
          }
        }
        presentation {
          id
          value
          type
        }
        created
        updated
        
        
      }
    `;
  return fragment;
};

export const getSurveyTargetAudiences = <WC = unknown, FC = unknown, PT = unknown>(
  executor: QueryExecutor,
  input?: GQLConnectionInput,
  fragment?: GQLQueryData
): Promise<GQLConnection<SurveyTargetAudience<WC, FC, PT>>> => {
  const finalFragment = fragment
    ? queryDataToQueryObject(fragment)
    : getSurveyTargetAudienceFragment();

  const query = gqlparse`
    query QuerySurveyTargetAudienceConnection($input: ConnectionInput){
        connection:getSurveyTargetAudiences(input:$input){
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
  return executor<{ connection: GQLConnection<SurveyTargetAudience<WC, FC, PT>> }>(query, {
    input
  })
    .then(throwGQLErrors)
    .then((result) => result.data.connection)
    .then(mapConnectionNodesF(standardizeSurveyTargetAudience));
};

export const getSurveyTargetAudience = (
  executor: QueryExecutor,
  id: string,
  fragment?: GQLQueryData
): Promise<SurveyTargetAudience | undefined | null> => {
  const finalFragment = fragment
    ? queryDataToQueryObject(fragment)
    : getSurveyTargetAudienceFragment();

  const query = `
    query QuerySurveyTargetAudience($id: ID!){
        audience: getSurveyTargetAudience(id:$id){
         ... ${finalFragment.operationName}
        }
      }
      ${finalFragment.query}
    `;
  return executor<{ audience: SurveyTargetAudience | undefined | null }>(query, { id })
    .then(throwGQLErrors)
    .then((result) => result.data.audience)
    .then((item) => (item ? standardizeSurveyTargetAudience(item) : item));
};

export const createSurveyTargetAudience = (
  executor: QueryExecutor,
  input: SurveyTargetAudienceInput,
  fragment?: GQLQueryData
): Promise<SurveyTargetAudience> => {
  const finalFragment = fragment
    ? queryDataToQueryObject(fragment)
    : getSurveyTargetAudienceFragment();
  const query = `
  mutation MutationCreateSurveyTargetAudience($input: SurveyTargetAudienceInput!){
    audience:createSurveyTargetAudience(input: $input){
      ...${finalFragment.operationName}
    }
  }
  ${finalFragment.query}
  `;
  return executor<{ audience: SurveyTargetAudience }>(query, { input })
    .then(throwGQLErrors)
    .then((result) => result.data.audience)
    .then(standardizeSurveyTargetAudience);
};
export const updateSurveyTargetAudience = (
  executor: QueryExecutor,
  id: string,
  input: Partial<SurveyTargetAudienceInput>,
  fragment?: GQLQueryData
): Promise<SurveyTargetAudience> => {
  const finalFragment = fragment
    ? queryDataToQueryObject(fragment)
    : getSurveyTargetAudienceFragment();
  const query = `
  mutation MutationUpdateSurveyTargetAudience($id:ID!,$input: SurveyTargetAudiencePartialInput!){
    audience:updateSurveyTargetAudience(id: $id,input: $input){
      ...${finalFragment.operationName}
    }
  }
  ${finalFragment.query}
  `;
  return executor<{ audience: SurveyTargetAudience }>(query, { id, input })
    .then(throwGQLErrors)
    .then((result) => result.data.audience)
    .then(standardizeSurveyTargetAudience);
};
export const deleteSurveyTargetAudience = (
  executor: QueryExecutor,
  id: string
): Promise<boolean> => {
  const query = `
  mutation MutationDeleteSurveyTargetAudience($id:ID!){
    successful:deleteSurveyTargetAudience(id: $id)
  }
  `;
  return executor<{ successful: boolean }>(query, { id })
    .then(throwGQLErrors)
    .then((result) => result.data.successful);
};
