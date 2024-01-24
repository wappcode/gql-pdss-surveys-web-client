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
import { BuildSurveySectionInput, SurveySection, SurveySectionInput } from '../models';
import { standardizeCreateAndUpdate } from './standardize-dates.fn';
import {
  createInputFromSurveyConfiguration,
  standardizeSurveyConfiguration
} from './survey-configuration.fn';
import { createBuildInputFromSurveyContent, standardizeSurveyContent } from './survey-content.fn';
import {
  createBuildInputFromSurveySectionItem,
  standardizeSurveySectionItem
} from './survey-section-item.fn';

export const standardizeSurveySection = <SC, SP>(
  section: SurveySection<SC, SP>
): SurveySection<SC, SP> => {
  const standardizedDates = standardizeCreateAndUpdate(section);
  let { content, presentation, items } = section;

  content = standardizeSurveyContent(content);
  presentation = standardizeSurveyConfiguration(presentation);
  if (Array.isArray(items)) {
    items = items.map(standardizeSurveySectionItem).sort((a, b) => a.order - b.order);
  }
  return { ...standardizedDates, content, items, presentation };
};

export const getSurveySectionFragment = (): GQLQueryObject => {
  const fragment = gqlparse`
  fragment fragmentSurveySection on SurveySection{
    id
    title
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
    items {
      id
      type
      order
      conditions{
        id
        value
        type
      }
      question{
        id
        code
        title
        type
        required
        other
        hint{
          id
            type
            body
            presentation{
              id
              value
              type
            }      
        }
        options{
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
              type
              value
            }
          }
        }
        content{
          id
          type
          body
          presentation{
            id
            type
            value
          }
        }
        presentation {
          id
          type
          value
        }
        answerScore{
          id
          type
          value
        }
        score
        survey{
            id  
        }
        validators{
          id
          type
          value
        }
        
      }
      content{
        id
        type
        body
        presentation{
          id
          type
          value
        }
      }
      hidden
    }
    order
    hidden
    presentation{
      id
      type
      value
    }
    survey{
      id
    }
    
    created
    updated
    
  }
    `;
  return fragment;
};

export const getSurveySections = <SC, SP>(
  executor: QueryExecutor,
  input?: GQLConnectionInput,
  fragment?: GQLQueryData
): Promise<GQLConnection<SurveySection<SC, SP>>> => {
  const finalFragment = fragment ? queryDataToQueryObject(fragment) : getSurveySectionFragment();

  const query = gqlparse`
  query QuerySurveySectionConnection($input: ConnectionInput){
    connection: getSurveySections(input: $input){
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
  return executor<{ connection: GQLConnection<SurveySection<SC, SP>> }>(query, { input })
    .then(throwGQLErrors)
    .then((result) => result.data.connection)
    .then(mapConnectionNodesF(standardizeSurveySection));
};

export const getSurveySection = <SC, SP>(
  executor: QueryExecutor,
  id: string,
  fragment?: GQLQueryData
): Promise<SurveySection<SC, SP> | null> => {
  const finalFragment = fragment ? queryDataToQueryObject(fragment) : getSurveySectionFragment();
  const query = gqlparse`
  query QuerySurveySection($id: ID!){
    section: getSurveySection(id: $id){
     ...${finalFragment.operationName}
    }
  }
  ${finalFragment.query}
  `;
  return executor<{ section: SurveySection<SC, SP> | null }>(query, { id })
    .then(throwGQLErrors)
    .then((result) => result.data.section)
    .then((section) => (section ? standardizeSurveySection(section) : null));
};

export const createSurveySection = (
  executor: QueryExecutor,
  input: SurveySectionInput,
  fragment?: GQLQueryData
): Promise<SurveySection> => {
  const finalFragment = fragment ? queryDataToQueryObject(fragment) : getSurveySectionFragment();
  const query = `
  mutation MutationCreateSurveySection($input: SurveySectionInput!){
    section:createSurveySection(input: $input){
      ...${finalFragment.operationName}
    }
  }
  ${finalFragment.query}
  `;
  return executor<{ section: SurveySection }>(query, { input })
    .then(throwGQLErrors)
    .then((result) => result.data.section)
    .then(standardizeSurveySection);
};
export const updateSurveySection = (
  executor: QueryExecutor,
  id: string,
  input: Partial<SurveySectionInput>,
  fragment?: GQLQueryData
): Promise<SurveySection> => {
  const finalFragment = fragment ? queryDataToQueryObject(fragment) : getSurveySectionFragment();
  const query = `
  mutation MutationUpdateSurveySection($id:ID!,$input: SurveySectionPartialInput!){
    section:updateSurveySection(id: $id,input: $input){
      ...${finalFragment.operationName}
    }
  }
  ${finalFragment.query}
  `;
  return executor<{ section: SurveySection }>(query, { id, input })
    .then(throwGQLErrors)
    .then((result) => result.data.section)
    .then(standardizeSurveySection);
};
export const deleteSurveySection = (executor: QueryExecutor, id: string): Promise<boolean> => {
  const query = `
  mutation MutationDeleteSurveySection($id:ID!){
    successful:deleteSurveySection(id: $id)
  }
  `;
  return executor<{ successful: boolean }>(query, { id })
    .then(throwGQLErrors)
    .then((result) => result.data.successful);
};

export const buildSurveySection = (
  executor: QueryExecutor,
  input: BuildSurveySectionInput,
  fragment?: GQLQueryData
): Promise<SurveySection> => {
  const finalFragment = fragment ? queryDataToQueryObject(fragment) : getSurveySectionFragment();
  const query = `
  mutation MutationBuildSurveySection($input: BuildSurveySectionInput!){
    section: buildSurveySection(input:$input){
      ...${finalFragment.operationName}
    }
  }
  ${finalFragment.query}
  `;

  return executor<{ section: SurveySection }>(query, { input })
    .then(throwGQLErrors)
    .then((result) => result.data.section)
    .then(standardizeSurveySection);
};

export const createInputFromSurveySection = (section: SurveySection): SurveySectionInput => {
  const { title, content, order, hidden, presentation, survey } = section;

  const presentationId = presentation?.id ?? undefined;
  const contentId = content?.id ?? undefined;
  const surveyId = survey?.id ?? undefined;

  return {
    title,
    content: contentId,
    order,
    hidden,
    presentation: presentationId,
    survey: surveyId
  };
};
export const createBuildInputFromSurveySection = (
  section: SurveySection
): BuildSurveySectionInput => {
  const { title, content, order, hidden, presentation, survey, items, id } = section;

  const presentationId = presentation
    ? createInputFromSurveyConfiguration(presentation)
    : undefined;
  const contentId = content ? createBuildInputFromSurveyContent(content) : undefined;
  const surveyId = survey?.id ?? undefined;

  const itemsInput =
    items && Array.isArray(items) ? items.map(createBuildInputFromSurveySectionItem) : [];

  return {
    id,
    title,
    content: contentId,
    order,
    hidden,
    presentation: presentationId,
    survey: surveyId,
    items: itemsInput
  };
};
