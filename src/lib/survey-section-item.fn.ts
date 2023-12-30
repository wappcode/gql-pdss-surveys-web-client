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
import { SurveySectionItem } from '../models';
import { standardizeCreateAndUpdate } from './standardize-dates.fn';
import { standardizeSurveyConfiguration } from './survey-configuration.fn';
import { standardizeSurveyContent } from './survey-content.fn';
import { standardizeSurveyQuestion } from './survey-question.fn';

export const standardizeSurveySectionItem = <ICD, ICT, QC, QP, QV, QAS, OCT, OPT>(
  item: SurveySectionItem<ICD, ICT, QC, QP, QV, QAS, OCT, OPT>
): SurveySectionItem<ICD, ICT, QC, QP, QV, QAS, OCT, OPT> => {
  const standardizedDates = standardizeCreateAndUpdate(item);
  let { content, conditions, question } = item;
  content = standardizeSurveyContent(content);
  conditions = standardizeSurveyConfiguration(conditions);
  if (question) {
    question = standardizeSurveyQuestion(question);
  }
  return { ...standardizedDates, content, conditions };
};

export const getSurveySectionItemFragment = (): GQLQueryObject => {
  const fragment = gqlparse`
  fragment fragmentSurveySectionItem on SurveySectionItem{
 
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
  created
  updated
  
}
    `;
  return fragment;
};

export const surveySectionItemConnection = <ICD, ICT, QC, QP, QV, QAS, OCT, OPT>(
  executor: QueryExecutor,
  input?: GQLConnectionInput,
  fragment?: GQLQueryData
): Promise<GQLConnection<SurveySectionItem<ICD, ICT, QC, QP, QV, QAS, OCT, OPT>>> => {
  const finalFragment = fragment
    ? queryDataToQueryObject(fragment)
    : getSurveySectionItemFragment();
  const query = gqlparse`
  query QuerySurveySectionItemConnection($input: ConnectionInput){
    connection: surveySectionItemConnection(input: $input){
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
  return executor<{
    connection: GQLConnection<SurveySectionItem<ICD, ICT, QC, QP, QV, QAS, OCT, OPT>>;
  }>(query, { input })
    .then(throwGQLErrors)
    .then((result) => result.data.connection)
    .then(mapConnectionNodesF(standardizeSurveySectionItem));
};

export const surveySectionItem = <ICD, ICT, QC, QP, QV, QAS, OCT, OPT>(
  executor: QueryExecutor,
  id: string,
  fragment?: GQLQueryData
): Promise<SurveySectionItem<ICD, ICT, QC, QP, QV, QAS, OCT, OPT> | null> => {
  const finalFragment = fragment
    ? queryDataToQueryObject(fragment)
    : getSurveySectionItemFragment();
  const query = gqlparse`
  query QuerySurveySectionItem($id: ID!){
    item: surveySectionItem(id: $id){
     ...${finalFragment.operationName}
    }
  }
  ${finalFragment.query}
  `;
  return executor<{ item: SurveySectionItem<ICD, ICT, QC, QP, QV, QAS, OCT, OPT> | null }>(query, {
    id
  })
    .then(throwGQLErrors)
    .then((result) => result.data.item)
    .then((item) => (item ? standardizeSurveySectionItem(item) : null));
};