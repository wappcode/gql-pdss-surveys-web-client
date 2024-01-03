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
import { SurveyQuestionOption, SurveyQuestionOptionInput } from '../models';
import { standardizeCreateAndUpdate } from './standardize-dates.fn';
import { standardizeSurveyConfiguration } from './survey-configuration.fn';
import { standardizeSurveyContent } from './survey-content.fn';

export const standardizeSurveyQuestionOption = <CT, PT>(
  option: SurveyQuestionOption<CT, PT>
): SurveyQuestionOption<CT, PT> => {
  const standardized = standardizeCreateAndUpdate(option);
  let { content, presentation } = option;
  content = standardizeSurveyContent<CT>(content);
  presentation = standardizeSurveyConfiguration<PT>(presentation);
  return { ...standardized, content, presentation };
};

export const getSurveyQuestionOptionFragment = (): GQLQueryObject => {
  const fragment = gqlparse`
  fragment fragmentSurveyQuestionOption on SurveyQuestionOption{
    id
    value
    title
    order
    content{
      id
      type
      body
      presentation{
        id
        value
        type
        
      }
    }
    presentation{
      id
      value
      type
    }
    question{
      id
      code
    }
    created
    updated
    
  }
    `;
  return fragment;
};

export const getSurveyQuestionOptions = <CT, PT>(
  executor: QueryExecutor,
  input?: GQLConnectionInput,
  fragment?: GQLQueryData
): Promise<GQLConnection<SurveyQuestionOption<CT, PT>>> => {
  const finalFragment = fragment
    ? queryDataToQueryObject(fragment)
    : getSurveyQuestionOptionFragment();
  const query = gqlparse`
    query QuerySurveyQuestionOptionConnection($input: ConnectionInput){
        connection: getSurveyQuestionOptions(input: $input){
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
  return executor<{ connection: GQLConnection<SurveyQuestionOption<CT, PT>> }>(query, { input })
    .then(throwGQLErrors)
    .then((result) => result.data.connection)
    .then(mapConnectionNodesF(standardizeSurveyQuestionOption));
};

export const getSurveyQuestionOption = <CT, PT>(
  executor: QueryExecutor,
  id: string,
  fragment?: GQLQueryData
): Promise<SurveyQuestionOption<CT, PT> | null> => {
  const finalFragment = fragment
    ? queryDataToQueryObject(fragment)
    : getSurveyQuestionOptionFragment();

  const query = gqlparse`
  query QuerySurveyQuestionOption($id: ID!){
    option: getSurveyQuestionOption(id: $id){
      ...${finalFragment.operationName} 
    }
  }
  ${finalFragment.query}
    `;
  return executor<{ option: SurveyQuestionOption<CT, PT> | null }>(query, { id })
    .then(throwGQLErrors)
    .then((result) => result.data.option)
    .then((option) => (option ? standardizeSurveyQuestionOption(option) : null));
};

export const createSurveyQuestionOption = (
  executor: QueryExecutor,
  input: SurveyQuestionOptionInput,
  fragment?: GQLQueryData
): Promise<SurveyQuestionOption> => {
  const finalFragment = fragment
    ? queryDataToQueryObject(fragment)
    : getSurveyQuestionOptionFragment();
  const query = `
  mutation MutationCreateSurveyQuestionOption($input: SurveyQuestionOptionInput!){
    questionOption:createSurveyQuestionOption(input: $input){
      ...${finalFragment.operationName}
    }
  }
  ${finalFragment.query}
  `;
  return executor<{ questionOption: SurveyQuestionOption }>(query, { input })
    .then(throwGQLErrors)
    .then((result) => result.data.questionOption)
    .then(standardizeSurveyQuestionOption);
};
export const updateSurveyQuestionOption = (
  executor: QueryExecutor,
  id: string,
  input: Partial<SurveyQuestionOptionInput>,
  fragment?: GQLQueryData
): Promise<SurveyQuestionOption> => {
  const finalFragment = fragment
    ? queryDataToQueryObject(fragment)
    : getSurveyQuestionOptionFragment();
  const query = `
  mutation MutationUpdateSurveyQuestionOption($id:ID!,$input: SurveyQuestionOptionPartialInput!){
    questionOption:updateSurveyQuestionOption(id: $id,input: $input){
      ...${finalFragment.operationName}
    }
  }
  ${finalFragment.query}
  `;
  return executor<{ questionOption: SurveyQuestionOption }>(query, { id, input })
    .then(throwGQLErrors)
    .then((result) => result.data.questionOption)
    .then(standardizeSurveyQuestionOption);
};
export const deleteSurveyQuestionOption = (
  executor: QueryExecutor,
  id: string
): Promise<boolean> => {
  const query = `
  mutation MutationDeleteSurveyQuestionOption($id:ID!){
    successful:deleteSurveyQuestionOption(id: $id)
  }
  `;
  return executor<{ successful: boolean }>(query, { id })
    .then(throwGQLErrors)
    .then((result) => result.data.successful);
};
