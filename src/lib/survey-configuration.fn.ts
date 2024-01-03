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
import { SurveyConfiguration, SurveyConfigurationInput } from '../models';

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

export const getSurveyConfigurations = <T>(
  executor: QueryExecutor,
  input?: GQLConnectionInput,
  fragment?: GQLQueryData
): Promise<GQLConnection<SurveyConfiguration<T>>> => {
  const finalFragment = fragment
    ? queryDataToQueryObject(fragment)
    : getSurveyConfigurationFragment();
  const query = gqlparse`
  query QuerySurveyConfigurationConnection($input: ConnectionInput){
    connection: getSurveyConfigurations(input: $input){
   
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
    .then(throwGQLErrors)
    .then((result) => result.data.connection)
    .then(mapConnectionNodesF((item) => standardizeSurveyConfiguration(item)!));
};

export const getSurveyConfiguration = <T>(
  executor: QueryExecutor,
  id: string,
  fragment?: GQLQueryData
): Promise<SurveyConfiguration<T> | null> => {
  const finalFragment = fragment
    ? queryDataToQueryObject(fragment)
    : getSurveyConfigurationFragment();
  const query = gqlparse`
  query QuerySurveyConfiguration($id: ID!){
    configuration: getSurveyConfiguration(id: $id){
          ...${finalFragment.operationName} 
    }
  }
  ${finalFragment.query}
    `;
  return executor<{ configuration: SurveyConfiguration<T> | null }>(query, { id })
    .then(throwGQLErrors)
    .then((result) => result.data.configuration)
    .then((config) => (config ? standardizeSurveyConfiguration(config)! : null));
};

export const createSurveyConfiguration = <T>(
  executor: QueryExecutor,
  input: SurveyConfigurationInput,
  fragment?: GQLQueryData
): Promise<SurveyConfiguration<T>> => {
  const finalFragment = fragment
    ? queryDataToQueryObject(fragment)
    : getSurveyConfigurationFragment();
  const query = `
  mutation MutationCreateSurveyConfiguration($input: SurveyConfigurationInput!){
    questionOption:createSurveyConfiguration(input: $input){
      ...${finalFragment.operationName}
    }
  }
  ${finalFragment.query}
  `;
  return executor<{ questionOption: SurveyConfiguration<T> }>(query, { input })
    .then(throwGQLErrors)
    .then((result) => result.data.questionOption)
    .then((content) => standardizeSurveyConfiguration(content)!);
};
export const updateSurveyConfiguration = <T>(
  executor: QueryExecutor,
  id: string,
  input: Partial<SurveyConfigurationInput>,
  fragment?: GQLQueryData
): Promise<SurveyConfiguration<T>> => {
  const finalFragment = fragment
    ? queryDataToQueryObject(fragment)
    : getSurveyConfigurationFragment();
  const query = `
  mutation MutationUpdateSurveyConfiguration($id:ID!,$input: SurveyConfigurationPartialInput!){
    questionOption:updateSurveyConfiguration(id: $id,input: $input){
      ...${finalFragment.operationName}
    }
  }
  ${finalFragment.query}
  `;
  return executor<{ questionOption: SurveyConfiguration<T> }>(query, { id, input })
    .then(throwGQLErrors)
    .then((result) => result.data.questionOption)
    .then((content) => standardizeSurveyConfiguration(content)!);
};
export const deleteSurveyConfiguration = (
  executor: QueryExecutor,
  id: string
): Promise<boolean> => {
  const query = `
  mutation MutationDeleteSurveyConfiguration($id:ID!){
    successful:deleteSurveyConfiguration(id: $id)
  }
  `;
  return executor<{ successful: boolean }>(query, { id })
    .then(throwGQLErrors)
    .then((result) => result.data.successful);
};
