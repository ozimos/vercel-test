import { HttpLink } from '@apollo/client'
import { NextPageContext } from 'next'
import { isServer, getServerURL, getClientURL } from './common'



export default function createIsomorphLink(context: Partial<NextPageContext>) {
    if (isServer() && context) {
      if (process.env.NODE_ENV === 'development') require('nexus').default.reset()
  
      const app = require('nexus').default
      require('../graphql/schema')
  
      app.assemble()
      // const app = { server: { handlers: { graphql(req, res) {} } } }
      const NexusHandlerLink = require('./apollo-link-nexusHandler').default
      // const httpMocks = require('node-mocks-http')
      const cookie = require('cookie')
  
      const res = context?.res
      const cookies = cookie.parse(context.req?.headers?.cookie || '')
  
      const req: any = {
        method: 'POST',
        headers: context?.req?.headers,
      }
      req.cookies = cookies
      req.res = res
      return new NexusHandlerLink({ req, res, handler: app.server.handlers.graphql })
    } else {
      return new HttpLink({
        uri: isServer() ? getServerURL() : getClientURL(),
        credentials: 'same-origin',
      })
    }
  }
  