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
import { SurveyContent } from '../models';
import { standardizeSurveyConfiguration } from './survey-configuration.fn';

export const standardizeSurveyContent = <PT>(
  content?: SurveyContent<PT>
): SurveyContent<PT> | undefined => {
  if (!content) {
    return content;
  }
  const presentation = standardizeSurveyConfiguration<PT>(content.presentation);
  return { ...content, presentation };
};

export const getSurveyContentFragment = (): GQLQueryObject => {
  const query = gqlparse`
    fragment fragmentSurveyContent on SurveyContent {
        id
        body
        type
        created
        updated
        
      }
    `;
  return query;
};

export const surveyContentConnection = <PT>(
  executor: QueryExecutor,
  input?: GQLConnectionInput,
  fragment?: GQLQueryData
): Promise<GQLConnection<SurveyContent<PT>>> => {
  const finalFragment = fragment ? queryDataToQueryObject(fragment) : getSurveyContentFragment();
  const query = gqlparse`
  query QuerySurveyContentConnection($input: ConnectionInput){
    connection: surveyContentConnection(input: $input){
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
  return executor<{ connection: GQLConnection<SurveyContent<PT>> }>(query, { input })
    .then(throwGQLErrors)
    .then((result) => result.data.connection)
    .then(mapConnectionNodesF((content) => standardizeSurveyContent(content)!));
};

export const surveyContent = <PT>(
  executor: QueryExecutor,
  id: string,
  fragment?: GQLQueryData
): Promise<SurveyContent<PT> | null> => {
  const finalFragment = fragment ? queryDataToQueryObject(fragment) : getSurveyContentFragment();
  const query = gqlparse`
  query QuerySurveyContent($id: ID!){
    content: surveyContent(id: $id){
          ...${finalFragment.operationName} 
    }
  }
  ${finalFragment.query}
  `;
  return executor<{ content: SurveyContent<PT> | null }>(query, { id })
    .then(throwGQLErrors)
    .then((result) => result.data.content)
    .then((content) => (content ? standardizeSurveyContent(content)! : null));
};
