import { ServerResponse } from 'http'
import cookie from 'cookie'

export default async function serverExec(queryDocument, context) {
  if (process.env.NODE_ENV === 'development') require('nexus').default.reset()

  const app = require('nexus').default
  require('./schema')

  app.assemble()
  const req: any = {
    method: 'POST',
    headers: context?.req?.headers,
    body: {
      query: queryDocument.loc.source.body,
    },
  }
  // const res = new MockRes()
  const res = new ServerResponse({ ...req })
  const cookies = cookie.parse(context.req?.headers?.cookie || '')
  req.cookies = cookies
  req.res = res
  const response = await app.server.handlers.graphql(req, res)
  // const result = res._getJSON()
  const result = JSON.parse(
    Buffer.concat(
      // @ts-ignore
      res.outputData
        .filter(({ data }) => {
          return data instanceof Buffer
        })
        .map(({ data }) => data)
    ).toString()
  )
  return { ROOT_QUERY: { __typename: 'Query', ...result.data } }
}
