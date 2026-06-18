import { graphql } from '~/shared/api/graphql/__generated__/gql'

export const ME_QUERY = graphql(`
  query Me {
    me {
      id
      email
      username
    }
  }
`)
