import {
  GQLConnection,
  GQLConnectionInput,
  GQLQueryData,
  QueryExecutor,
  gqlparse,
  queryDataToQueryObject,
  mapConnectionNodesF
} from 'graphql-client-utilities';
import { SurveyTargetAudience } from '../models';
import { standardizeSurveyContent } from './survey-content.fn';
import { standardizeSurveyConfiguration } from './survey-configuration';
import { standardizeCreateAndUpdate, standardizeDate } from './standardize-dates.fn';

export const standardizeSurveyTargetAudience = <WC, FC, PT>(
  audience: SurveyTargetAudience<WC, FC, PT>
): SurveyTargetAudience<WC, FC, PT> => {
  let { welcome, farewell, presentation, starts, ends } = audience;
  welcome = standardizeSurveyContent<WC>(welcome);
  farewell = standardizeSurveyContent<FC>(farewell);
  presentation = standardizeSurveyConfiguration<PT>(presentation);
  starts = standardizeDate(starts);
  ends = standardizeDate(ends);
  const standarAudience = standardizeCreateAndUpdate(audience);
  return { ...standarAudience, welcome, farewell, presentation, starts, ends };
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

export const surveyTargetAudienceConnection = <WC = unknown, FC = unknown, PT = unknown>(
  executor: QueryExecutor,
  input?: GQLConnectionInput,
  fragment?: GQLQueryData
): Promise<GQLConnection<SurveyTargetAudience<WC, FC, PT>>> => {
  const finalFragment = fragment
    ? queryDataToQueryObject(fragment)
    : getSurveyTargetAudienceFragment();

  const query = gqlparse`
    query QuerySurveyTargetAudienceConnection($input: ConnectionInput){
        connection:surveyTargetAudienceConnection(input:$input){
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
    .then((result) => result.data.connection)
    .then(mapConnectionNodesF(standardizeSurveyTargetAudience));
};

export const surveyTargetAudience = (
  executor: QueryExecutor,
  id: string,
  fragment?: GQLQueryData
): Promise<SurveyTargetAudience | undefined | null> => {
  const finalFragment = fragment
    ? queryDataToQueryObject(fragment)
    : getSurveyTargetAudienceFragment();

  const query = `
    query QuerySurveyTargetAudience($id: ID!){
        audience: surveyTargetAudience(id:$id){
         ... ${finalFragment.operationName}
        }
      }
      ${finalFragment.query}
    `;
  return executor<{ audience: SurveyTargetAudience | undefined | null }>(query, { id })
    .then((result) => result.data.audience)
    .then((item) => (item ? standardizeSurveyTargetAudience(item) : item));
};
