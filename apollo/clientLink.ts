import { HttpLink } from '@apollo/client'
import { getClientURL } from './common'

export default function createHttpLink() {
  return new HttpLink({
    uri: getClientURL(),
    credentials: 'same-origin',
  })
}
