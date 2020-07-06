// import { ApolloProvider } from '@apollo/client'
import { AppProps } from 'next/app'
// import { useApollo } from '../apollo/apolloClient'
import '../styles/global.css'

export default function App({ Component, pageProps }: AppProps) {
  // const apolloClient = useApollo(pageProps.initialApolloState)
  return <Component {...pageProps} />
}
  //  (
  //    <ApolloProvider client={apolloClient}>
  //   </ApolloProvider>
  //    )
