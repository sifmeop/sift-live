import { graphql } from '~/shared/api/graphql/__generated__/gql'

export const LOGOUT_MUTATION = graphql(`
  mutation Logout {
    logout
  }
`)
