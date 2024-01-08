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
import { BuildSurveyContentInput, SurveyContent, SurveyContentInput } from '../models';
import {
  createInputFromSurveyConfiguration,
  standardizeSurveyConfiguration
} from './survey-configuration.fn';

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

export const getSurveyContents = <PT>(
  executor: QueryExecutor,
  input?: GQLConnectionInput,
  fragment?: GQLQueryData
): Promise<GQLConnection<SurveyContent<PT>>> => {
  const finalFragment = fragment ? queryDataToQueryObject(fragment) : getSurveyContentFragment();
  const query = gqlparse`
  query QuerySurveyContentConnection($input: ConnectionInput){
    connection: getSurveyContents(input: $input){
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

export const getSurveyContent = <PT>(
  executor: QueryExecutor,
  id: string,
  fragment?: GQLQueryData
): Promise<SurveyContent<PT> | null> => {
  const finalFragment = fragment ? queryDataToQueryObject(fragment) : getSurveyContentFragment();
  const query = gqlparse`
  query QuerySurveyContent($id: ID!){
    content: getSurveyContent(id: $id){
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

export const createSurveyContent = (
  executor: QueryExecutor,
  input: SurveyContentInput,
  fragment?: GQLQueryData
): Promise<SurveyContent> => {
  const finalFragment = fragment ? queryDataToQueryObject(fragment) : getSurveyContentFragment();
  const query = `
  mutation MutationCreateSurveyContent($input: SurveyContentInput!){
    questionOption:createSurveyContent(input: $input){
      ...${finalFragment.operationName}
    }
  }
  ${finalFragment.query}
  `;
  return executor<{ questionOption: SurveyContent }>(query, { input })
    .then(throwGQLErrors)
    .then((result) => result.data.questionOption)
    .then((content) => standardizeSurveyContent(content)!);
};
export const updateSurveyContent = (
  executor: QueryExecutor,
  id: string,
  input: Partial<SurveyContentInput>,
  fragment?: GQLQueryData
): Promise<SurveyContent> => {
  const finalFragment = fragment ? queryDataToQueryObject(fragment) : getSurveyContentFragment();
  const query = `
  mutation MutationUpdateSurveyContent($id:ID!,$input: SurveyContentPartialInput!){
    questionOption:updateSurveyContent(id: $id,input: $input){
      ...${finalFragment.operationName}
    }
  }
  ${finalFragment.query}
  `;
  return executor<{ questionOption: SurveyContent }>(query, { id, input })
    .then(throwGQLErrors)
    .then((result) => result.data.questionOption)
    .then((content) => standardizeSurveyContent(content)!);
};
export const deleteSurveyContent = (executor: QueryExecutor, id: string): Promise<boolean> => {
  const query = `
  mutation MutationDeleteSurveyContent($id:ID!){
    successful:deleteSurveyContent(id: $id)
  }
  `;
  return executor<{ successful: boolean }>(query, { id })
    .then(throwGQLErrors)
    .then((result) => result.data.successful);
};

export const createInputFromSurveyContent = (content: SurveyContent): SurveyContentInput => {
  const { type, body, presentation } = content;
  const presentationId = presentation?.id ?? undefined;
  return { type, body, presentation: presentationId };
};

export const createBuildInputFromSurveyContent = (
  content: SurveyContent
): BuildSurveyContentInput => {
  const { type, body, presentation } = content;
  const inputPresentation = presentation
    ? createInputFromSurveyConfiguration(presentation)
    : undefined;
  return { type, body, presentation: inputPresentation };
};
