import { graphql } from '~/shared/api/graphql'

export const LOGIN_MUTATION = graphql(`
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      accessToken
      user {
        id
        email
        username
      }
    }
  }
`)
