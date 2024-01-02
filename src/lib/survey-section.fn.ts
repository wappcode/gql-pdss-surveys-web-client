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
import { SurveySection } from '../models';
import { standardizeCreateAndUpdate } from './standardize-dates.fn';
import { standardizeSurveyConfiguration } from './survey-configuration.fn';
import { standardizeSurveyContent } from './survey-content.fn';
import { standardizeSurveySectionItem } from './survey-section-item.fn';

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
