import { graphql } from '~/shared/api/graphql/__generated__/gql'

export const REFRESH_MUTATION = graphql(`
  mutation Refresh {
    refresh {
      accessToken
    }
  }
`)
