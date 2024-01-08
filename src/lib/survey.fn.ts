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
import { BuildSurveyInput, BuildSurveyTargetAudienceInput, Survey, SurveyInput } from '../models';
import { standardizeCreateAndUpdate } from './standardize-dates.fn';
import { createBuildInputFromSurveySection, standardizeSurveySection } from './survey-section.fn';

export const standardizeSurvey = (survey: Survey): Survey => {
  const standarSurvey = standardizeCreateAndUpdate(survey);
  let { sections } = survey;
  if (Array.isArray(sections)) {
    sections = sections.map(standardizeSurveySection).sort((a, b) => a.order - b.order);
  }

  return { ...standarSurvey, sections };
};
export const getSurveyFragment = (): GQLQueryObject => {
  const query: GQLQueryObject = gqlparse`
  fragment fragmentSurvey on Survey{
    id
    title    
    created
    updated
  }

    `;
  return query;
};
export const getSurveyQuestionnaireFragment = (): GQLQueryObject => {
  const query: GQLQueryObject = gqlparse`
  fragment surveyQuestionnaireFragment on Survey {
    id
    title
    sections {
      id
      title
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
      items{
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
          title
          code
          type
          required
          other
          hint
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
            presentation{
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
              value
              type
            }
          }
          presentation{
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
    }
    
  }

    `;
  return query;
};

export const getSurveys = (
  executor: QueryExecutor,
  input?: GQLConnectionInput,
  fragment?: GQLQueryData
): Promise<GQLConnection<Survey>> => {
  const finalFragment: GQLQueryObject = fragment
    ? queryDataToQueryObject(fragment)
    : getSurveyFragment();

  const query = gqlparse`
  query QuerySurveyConnection($input: ConnectionInput){
    connection: getSurveys(input: $input){
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
  return executor<{ connection: GQLConnection<Survey> }>(query, { input })
    .then(throwGQLErrors)
    .then((result) => result.data.connection)
    .then(mapConnectionNodesF(standardizeSurvey));
};
export const getSurvey = (
  executor: QueryExecutor,
  id: string,
  fragment?: GQLQueryData
): Promise<Survey | undefined | null> => {
  const finalFragment = fragment ? queryDataToQueryObject(fragment) : getSurveyFragment();
  const query = `
    query QuerySurvey($id: ID!){
      survey: getSurvey(id:$id){
        ...${finalFragment.operationName}
      }
    }
    ${finalFragment.query}
  `;
  return executor<{ survey: Survey | undefined | null }>(query, { id })
    .then(throwGQLErrors)
    .then((result) => result.data.survey)
    .then((survey) => (survey ? standardizeSurvey(survey) : survey));
};

export const createSurvey = (
  executor: QueryExecutor,
  input: SurveyInput,
  fragment?: GQLQueryData
): Promise<Survey> => {
  const finalFragment = fragment ? queryDataToQueryObject(fragment) : getSurveyFragment();

  const mutation = gqlparse`
  mutation MutationCreateSurvey($input: SurveyInput!){
    survey: createSurvey(input: $input){
      ...${finalFragment.operationName}
    }
  }
  ${finalFragment.query}
  `;
  return executor<{ survey: Survey }>(mutation, { input })
    .then(throwGQLErrors)
    .then((result) => result.data.survey)
    .then(standardizeSurvey);
};
export const updateSurvey = (
  executor: QueryExecutor,
  id: string,
  input: Partial<SurveyInput>,
  fragment?: GQLQueryData
): Promise<Survey> => {
  const finalFragment = fragment ? queryDataToQueryObject(fragment) : getSurveyFragment();

  const mutation = gqlparse`
  mutation MutationUpdateSurvey($id: ID!,$input: SurveyPartialInput!){
    survey: updateSurvey(id:$id,input: $input){
      ...${finalFragment.operationName}
    }
  }
  ${finalFragment.query}
  `;
  return executor<{ survey: Survey }>(mutation, { input, id })
    .then(throwGQLErrors)
    .then((result) => result.data.survey)
    .then(standardizeSurvey);
};
export const deleteSurvey = (executor: QueryExecutor, id: string): Promise<boolean> => {
  const mutation = gqlparse`
  mutation MutationDeleteSurvey($id: ID!){
    success: deleteSurvey(id:$id)
  }
  `;
  return executor<{ success: boolean }>(mutation, { id })
    .then(throwGQLErrors)
    .then((result) => result.data.success);
};

export const buildSuvey = (
  executor: QueryExecutor,
  input: BuildSurveyInput,
  fragment?: GQLQueryData
): Promise<Survey> => {
  const finalFragment = fragment
    ? queryDataToQueryObject(fragment)
    : getSurveyQuestionnaireFragment();
  const mutation = gqlparse`
  mutation MutationBuildSurvey ($input: BuildSurveyInput!){
  
    survey: buildSurvey(input: $input){
  ...${finalFragment.operationName}
      
    }
    
  }
  ${finalFragment.query}
  `;
  return executor<{ survey: Survey }>(mutation, { input })
    .then(throwGQLErrors)
    .then((result) => result.data.survey)
    .then(standardizeSurvey);
};

export const crateInputFromSurvey = (survey: Survey): SurveyInput => {
  const { title, active } = survey;

  return { title, active };
};

export const createBuildInputFromSurvey = (
  survey: Survey,
  targetAudienceInput?: BuildSurveyTargetAudienceInput
): BuildSurveyInput => {
  const { title, sections, active } = survey;
  const sectionsInput =
    sections && Array.isArray(sections) ? sections.map(createBuildInputFromSurveySection) : [];
  return { title, targetAudience: targetAudienceInput, active, sections: sectionsInput };
};
