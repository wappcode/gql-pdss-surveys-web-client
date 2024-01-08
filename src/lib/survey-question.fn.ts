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
import { BuildSurveyQuestionInput, SurveyQuestion, SurveyQuestionInput } from '../models';
import { standardizeCreateAndUpdate } from './standardize-dates.fn';
import {
  createInputFromSurveyConfiguration,
  standardizeSurveyConfiguration
} from './survey-configuration.fn';
import { createBuildInputFromSurveyContent, standardizeSurveyContent } from './survey-content.fn';
import { standardizeSurveyQuestionOption } from './survey-question-option.fn';

export const standardizeSurveyQuestion = <QC, QP, QV, QAS, OCT, OPT>(
  question: SurveyQuestion<QC, QP, QV, QAS, OCT, OPT>
): SurveyQuestion<QC, QP, QV, QAS, OCT, OPT> => {
  const standardized = standardizeCreateAndUpdate(question);
  let { presentation, content, validators, answerScore, options } = question;
  presentation = standardizeSurveyConfiguration<QP>(presentation);
  content = standardizeSurveyContent<QC>(content);
  validators = standardizeSurveyConfiguration<QV[]>(validators);
  answerScore = standardizeSurveyConfiguration<QAS>(answerScore);
  if (Array.isArray(options)) {
    options = options.map(standardizeSurveyQuestionOption).sort((a, b) => a.order - b.order);
  }
  return { ...standardized, presentation, content, validators, answerScore, options };
};

export const getSurveyQuestionFragment = (): GQLQueryObject => {
  const query = gqlparse`
    fragment fragmentSurveyQuestion on SurveyQuestion {
        id
        type
        code
        title
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
              value
              type
            }      
          }
          presentation{
            value
            type
            id
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
          value
          type
          id
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
          value
          type
        }
        created
        updated
        
      }
    `;
  return query;
};
export const getSurveyQuestions = <QC, QP, QV, QAS, OCT, OPT>(
  executor: QueryExecutor,
  input?: GQLConnectionInput,
  fragment?: GQLQueryData
): Promise<GQLConnection<SurveyQuestion<QC, QP, QV, QAS, OCT, OPT>>> => {
  const finalFragment = fragment ? queryDataToQueryObject(fragment) : getSurveyQuestionFragment();

  const query = gqlparse`
    query QuerySurveyQuestionConnection($input: ConnectionInput){
        connection: getSurveyQuestions(input: $input){
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
  return executor<{ connection: GQLConnection<SurveyQuestion<QC, QP, QV, QAS, OCT, OPT>> }>(query, {
    input
  })
    .then(throwGQLErrors)
    .then((result) => result.data.connection)
    .then(mapConnectionNodesF(standardizeSurveyQuestion));
};

export const getSurveyQuestion = <QC, QP, QV, QAS, OCT, OPT>(
  executor: QueryExecutor,
  id: string,
  fragment?: GQLQueryData
): Promise<SurveyQuestion<QC, QP, QV, QAS, OCT, OPT> | null> => {
  const finalFragment = fragment ? queryDataToQueryObject(fragment) : getSurveyQuestionFragment();
  const query = gqlparse`
    query QuerySurveyQuestion($id: ID!){
        question: getSurveyQuestion(id: $id){
          ...${finalFragment.operationName}
        }
      }
      ${finalFragment.query}
    `;
  return executor<{ question: SurveyQuestion<QC, QP, QV, QAS, OCT, OPT> | null }>(query, {
    id
  })
    .then(throwGQLErrors)
    .then((result) => result.data.question)
    .then((question) => (question ? standardizeSurveyQuestion(question) : null));
};

export const createSurveyQuestion = (
  executor: QueryExecutor,
  input: SurveyQuestionInput,
  fragment?: GQLQueryData
): Promise<SurveyQuestion> => {
  const finalFragment = fragment ? queryDataToQueryObject(fragment) : getSurveyQuestionFragment();
  const query = `
  mutation MutationCreateSurveyQuestion($input: SurveyQuestionInput!){
    question:createSurveyQuestion(input: $input){
      ...${finalFragment.operationName}
    }
  }
  ${finalFragment.query}
  `;
  return executor<{ question: SurveyQuestion }>(query, { input })
    .then(throwGQLErrors)
    .then((result) => result.data.question)
    .then(standardizeSurveyQuestion);
};
export const updateSurveyQuestion = (
  executor: QueryExecutor,
  id: string,
  input: Partial<SurveyQuestionInput>,
  fragment?: GQLQueryData
): Promise<SurveyQuestion> => {
  const finalFragment = fragment ? queryDataToQueryObject(fragment) : getSurveyQuestionFragment();
  const query = `
  mutation MutationUpdateSurveyQuestion($id:ID!,$input: SurveyQuestionPartialInput!){
    question:updateSurveyQuestion(id: $id,input: $input){
      ...${finalFragment.operationName}
    }
  }
  ${finalFragment.query}
  `;
  return executor<{ question: SurveyQuestion }>(query, { id, input })
    .then(throwGQLErrors)
    .then((result) => result.data.question)
    .then(standardizeSurveyQuestion);
};
export const deleteSurveyQuestion = (executor: QueryExecutor, id: string): Promise<boolean> => {
  const query = `
  mutation MutationDeleteSurveyQuestion($id:ID!){
    successful:deleteSurveyQuestion(id: $id)
  }
  `;
  return executor<{ successful: boolean }>(query, { id })
    .then(throwGQLErrors)
    .then((result) => result.data.successful);
};

export const buildSurveyQuestion = (
  executor: QueryExecutor,
  input: BuildSurveyQuestionInput,
  fragment?: GQLQueryData
): Promise<SurveyQuestion> => {
  const finalFragment = fragment ? queryDataToQueryObject(fragment) : getSurveyQuestionFragment();

  const query = `
  mutation MutationBuildSurveyQuestion($input: BuildSurveyQuestionInput!){
    question: buildSurveyQuestion(input: $input){
      ...${finalFragment.operationName}
    }
  }
  ${finalFragment.query}
  
  `;
  return executor<{ question: SurveyQuestion }>(query, { input })
    .then(throwGQLErrors)
    .then((result) => result.data.question)
    .then(standardizeSurveyQuestion);
};

export const createInputFromSurveyQuestion = (question: SurveyQuestion): SurveyQuestionInput => {
  const {
    title,
    code,
    type,
    required,
    other,
    hint,
    content,
    presentation,
    validators,
    answerScore,
    score,
    survey
  } = question;

  const contentId = content?.id ?? undefined;
  const presentationId = presentation?.id ?? undefined;
  const validatorsId = validators?.id ?? undefined;
  const answerScoreId = answerScore?.id ?? undefined;
  const surveyId = survey?.id ?? undefined;

  return {
    title,
    code,
    required,
    type,
    other,
    hint,
    content: contentId,
    presentation: presentationId,
    validators: validatorsId,
    answerScore: answerScoreId,
    score,
    survey: surveyId
  };
};
export const createBuildInputFromSurveyQuestion = (
  question: SurveyQuestion
): BuildSurveyQuestionInput => {
  const {
    id,
    title,
    code,
    type,
    required,
    other,
    hint,
    content,
    presentation,
    validators,
    answerScore,
    score,
    survey
  } = question;

  const contentInput = content ? createBuildInputFromSurveyContent(content) : undefined;
  const presentationInput = presentation
    ? createInputFromSurveyConfiguration(presentation)
    : undefined;
  const validatorsInput = validators ? createInputFromSurveyConfiguration(validators) : undefined;
  const answerScoreInput = answerScore
    ? createInputFromSurveyConfiguration(answerScore)
    : undefined;
  const surveyId = survey?.id ?? undefined;

  return {
    id,
    title,
    code,
    required,
    type,
    other,
    hint,
    content: contentInput,
    presentation: presentationInput,
    validators: validatorsInput,
    answerScore: answerScoreInput,
    score,
    survey: surveyId
  };
};
