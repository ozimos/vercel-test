import { useMemo } from 'react'
import { ApolloClient, InMemoryCache, NormalizedCacheObject, from } from '@apollo/client'
import { NextPageContext } from 'next'
import {isServer} from './common'
import createIsomorphLink from './serverLink'

let apolloClient: ApolloClient<NormalizedCacheObject | InMemoryCache> | null = null

function createApolloClient(
  context: Partial<NextPageContext>
): ApolloClient<NormalizedCacheObject | InMemoryCache> {
  const cache = new InMemoryCache()
  const client = new ApolloClient({
    ssrMode: isServer(),
    // @ts-ignore
    link: from([createIsomorphLink(context)]),
    cache,
  })
  // @ts-ignore
  return client
}

export function initializeApollo(
  initialState: NormalizedCacheObject | InMemoryCache | null = null,
  context: Partial<NextPageContext> = null
) {
  const _apolloClient = apolloClient ?? createApolloClient(context)

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
  const store = useMemo(() => initializeApollo(initialState), [initialState])
  return store
}


