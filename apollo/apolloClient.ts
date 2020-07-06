import { useMemo } from 'react'
import { ApolloClient, HttpLink, InMemoryCache, NormalizedCacheObject, from } from '@apollo/client'


let apolloClient: ApolloClient<NormalizedCacheObject | InMemoryCache> | null = null
export const isServer = () => typeof window === 'undefined'
const backUpServerUrl = isServer() ? process.env.NEXT_PUBLIC_YUM_SERVER_URL : `${window.location.host}/api/graphql`
export const serverURL = process.env.VERCEL_URL || backUpServerUrl

function createApolloClient(serverAccessToken = ''): ApolloClient<NormalizedCacheObject | InMemoryCache> {
  const cache = new InMemoryCache()
  const client = new ApolloClient({
    ssrMode: isServer(),
    // @ts-ignore
    link: from([ createHttpLink()]),
    cache,
  })
  // @ts-ignore
  return client
}

export function initializeApollo(
  initialState: NormalizedCacheObject | InMemoryCache | null = null,
) {
  const _apolloClient = apolloClient ?? createApolloClient()

  // If your page has Next.js data fetching methods that use Apollo Client, the initial state
  // gets hydrated here
  if (initialState) {
    _apolloClient.cache.restore(initialState)
  }
  // For SSG and SSR always create a new Apollo Client
  if (isServer()) return _apolloClient
  // Create the Apollo Client once in the client
  if (!apolloClient) apolloClient = _apolloClient
  return _apolloClient
}

export function useApollo(initialState: any) {
  const store = useMemo(() => initializeApollo(initialState), [
    initialState,
  ])
  return store
}

function createHttpLink() {
  return new HttpLink({
    uri: `${serverURL}/api/graphql`,
    credentials: 'same-origin',
    fetch,
  })
}

