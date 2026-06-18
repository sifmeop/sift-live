import { graphql } from '~/shared/api/graphql'

export const REGISTER_MUTATION = graphql(`
  mutation Register($input: RegisterInput!) {
    register(input: $input) {
      accessToken
      user {
        id
        email
        username
      }
    }
  }
`)
