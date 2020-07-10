import { gql } from '@apollo/client'

export const TODO = gql`
  query TODO {
    todos {
      id
      description
    }
  }
`
export default TODO
