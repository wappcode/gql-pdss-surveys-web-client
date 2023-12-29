import {
  GQLConnection,
  GQLConnectionInput,
  GQLQueryData,
  GQLQueryObject,
  QueryExecutor,
  gqlparse,
  mapConnectionNodesF,
  queryDataToQueryObject
} from 'graphql-client-utilities';
import { SurveyConfiguration } from '../models';

export const standardizeSurveyConfiguration = <T>(
  config?: SurveyConfiguration<T>
): SurveyConfiguration<T> | undefined => {
  if (!config) {
    return config;
  }
  const value = JSON.parse(config.value as unknown as string);
  return { ...config, value };
};

export const getSurveyConfigurationFragment = (): GQLQueryObject => {
  const query = gqlparse`
  fragment fragmentSurveyConfiguration on SurveyConfiguration {
    id
    value
    type
    created
    updated
    
  }
  `;
  return query;
};

export const surveyConfigurationConnection = <T>(
  executor: QueryExecutor,
  input?: GQLConnectionInput,
  fragment?: GQLQueryData
): Promise<GQLConnection<SurveyConfiguration<T>>> => {
  const finalFragment = fragment
    ? queryDataToQueryObject(fragment)
    : getSurveyConfigurationFragment();
  const query = gqlparse`
  query QuerySurveyConfigurationConnection($input: ConnectionInput){
    connection: surveyConfigurationConnection(input: $input){
   
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
  return executor<{ connection: GQLConnection<SurveyConfiguration<T>> }>(query, { input })
    .then((result) => result.data.connection)
    .then(mapConnectionNodesF((item) => standardizeSurveyConfiguration(item)!));
};

export const surveyConfiguration = <T>(
  executor: QueryExecutor,
  id: string,
  fragment?: GQLQueryData
): Promise<SurveyConfiguration<T> | null> => {
  const finalFragment = fragment
    ? queryDataToQueryObject(fragment)
    : getSurveyConfigurationFragment();
  const query = gqlparse`
  query QuerySurveyConfiguration($id: ID!){
    configuration: surveyConfiguration(id: $id){
          ...${finalFragment.operationName} 
    }
  }
  ${finalFragment.query}
    `;
  return executor<{ configuration: SurveyConfiguration<T> | null }>(query, { id })
    .then((result) => result.data.configuration)
    .then((config) => (config ? standardizeSurveyConfiguration(config)! : null));
};