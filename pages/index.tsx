import { GetServerSideProps, GetServerSidePropsContext } from 'next'
import Head from 'next/head'
import { useQuery } from '@apollo/client'
import { initializeApollo } from '../apollo/apolloClient'
import TODO from '../documents/todo.query'
import Layout from '../components/layout'

export default function Home() {
  const { data } = useQuery(TODO)

  return (
    <Layout>
      <Head>
        <title>Next.js × Nexus Todo App</title>
      </Head>
      <p>
        Get <a href="https://www.electronjs.org/apps/graphql-playground">GraphQL Playground</a> and point it
        at /api/graphql.
      </p>
      <p>
        And the vercel url is <span>{process.env.VERCEL_URL}</span>{' '}
      </p>
      <p>
        And the fallback url is <span>{process.env.NEXT_PUBLIC_YUM_SERVER_URL}</span>{' '}
      </p>
      <p>Here are your todos</p>
      <ol>
        {data?.todos?.map(({ description }) => (
          <li key={description}>{description}</li>
        ))}
      </ol>
    </Layout>
  )
}

export const getServerSideProps: GetServerSideProps = async (context: GetServerSidePropsContext) => {
  // const apolloClient = initializeApollo(null, context)

  // await apolloClient.query({
  //   query: TODO,
  // })
  // const initialApolloState = apolloClient.cache.extract()

  const serverExec = require('../graphql/serverExec').default
  const initialApolloState = await serverExec(TODO, context)

  // console.log('success', apolloClient.cache.extract())
  return {
    props: {
      initialApolloState,
      unstable_revalidate: 1,
    },
  }
}
