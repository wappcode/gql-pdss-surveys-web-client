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
import { Survey } from '../models';
import { standardizeCreateAndUpdate } from './standardize-dates.fn';
import { standardizeSurveySection } from './survey-section.fn';

export const standardizeSurvey = (survey: Survey): Survey => {
  const standarSurvey = standardizeCreateAndUpdate(survey);
  let { sections } = survey;
  if (Array.isArray(sections)) {
    sections = sections.map(standardizeSurveySection).sort((a, b) => a.order - b.order);
  }

  return { ...standarSurvey, sections };
};
// Build survey
// {
//     "title": "Survey 1",
//     "sections": [
//       {
//         "title": "Section 1",
//         "content": {
//           "type": "HTML",
//           "body":"<h1>Hola mundo</h1>",
//           "presentation":{
//             "type":"PRESENTATION",
//             "value": "{className:\"section-content-title\"}"
//           }

//         },
//         "presentation":{
//            "type":"PRESENTATION",
//             "value": "{className:\"section-title\"}"
//         },
//         "order":1,
//         "hidden":false,
//         "items":[
//         {
//               "type":"CONTENT",

//           "order": 1,
//          "content": {
//           "type": "HTML",
//           "body": "<h2>Section Item</h2>"
//         },
//           "hidden": false

//         },
//           {
//             "type": "QUESTION",
//             "order": 2,
//             "question": {
//               "title": "Question Section 1",
//               "code": "Q01",
//               "type":""
//             }
//           }
//         ]

//       }
//     ]
//   }

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

export const surveyConnection = (
  executor: QueryExecutor,
  input?: GQLConnectionInput,
  fragment?: GQLQueryData
): Promise<GQLConnection<Survey>> => {
  const finalFragment: GQLQueryObject = fragment
    ? queryDataToQueryObject(fragment)
    : getSurveyFragment();

  const query = gqlparse`
  query QuerySurveyConnection($input: ConnectionInput){
    connection: surveysConnection(input: $input){
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
export const survey = (
  executor: QueryExecutor,
  id: string,
  fragment?: GQLQueryData
): Promise<Survey | undefined | null> => {
  const finalFragment = fragment ? queryDataToQueryObject(fragment) : getSurveyFragment();
  const query = `
    query QuerySurvey($id: ID!){
      survey: survey(id:$id){
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
