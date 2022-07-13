import { gql } from 'graphql-tag';

gql`
  query locale {
    survey(survey: state_of_js) {
      demographics {
        locale: locale(filters: {}, options: { cutoff: 20 }, facet: null) {
          keys
          year(year: 2021) {
            year
            completion {
              total
              percentage_survey
              count
            }
            facets {
              id
              type
              completion {
                total
                percentage_question
                percentage_survey
                count
              }
              buckets {
                id
                count
                percentage_question
                percentage_survey
              }
            }
          }
        }
      }
    }
  }
`;

export function Language() {
  return null;
}
