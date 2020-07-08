import { NextPageContext } from 'next'
import { ApolloLink, Operation, FetchResult, Observable, HttpLink } from '@apollo/client'
import { ClientRequest, ServerResponse } from 'http'
import { EventEmitter } from 'events'
import cookie from 'cookie'
import httpMocks from 'node-mocks-http'
import { isServer, getServerURL, getClientURL } from './common'

export namespace NexusHandler {
  export type NexusHandlerFunction = (req: ClientRequest, res: ServerResponse) => Record<string, any>

  export interface Options {
    /**
     * The nexus graphQL handler to generate responses from.
     */
    handler: any

    /**
     * A request object.
     */
    req?: ClientRequest

    /**
     * The response from the nexus handler.
     */
    res?: ServerResponse | Record<string, any>
  }
}

export class NexusHandlerLink extends ApolloLink {
  public handler: NexusHandler.NexusHandlerFunction | any
  public req: any
  public res: ServerResponse | any

  constructor({ handler, req, res }: NexusHandler.Options) {
    super()

    this.handler = handler
    this.req = req
    this.res = res
  }

  public request({ query, variables }: Operation): Observable<FetchResult> | null {
    this.req.body = { query: query.loc.source.body, variables }
    return new Observable<FetchResult>((observer) => {
      new Promise((resolve, reject) => {
        try {
          let body = []
          let stringBody = ''
          this.res.on('data', chunk => {body.push(chunk)})
          .on('end', function (chunk) {
            body.push(chunk)
            // stringBody = Buffer.concat(body).toString()
            this.body2 = body
            resolve(stringBody)
          })
          this.handler(this.req, this.res)
        } catch (error) {
          reject(error)
        }
      })
        // Promise.resolve(this.handler(this.req, this.res))
        .then((data) => {
          console.dir(data)
          console.dir(this.res.body)
          console.dir(this.res.body2)
          console.dir(this.res.error)
          console.log('getData', this.res._getData())
          console.log('encoding', this.res.getEncoding())
          if (!observer.closed) {
            observer.next(data)
            observer.complete()
          }
        })
        .catch((error) => {
          console.log('linkError', error)
          if (!observer.closed) {
            observer.error(error)
          }
        })
    })
  }
}

export default function createIsomorphLink(context: Partial<NextPageContext>) {
  if (isServer() && context) {
    if (process.env.NODE_ENV === 'development') require('nexus').default.reset()

    const app = require('nexus').default
    require('../graphql/schema')

    app.assemble()

    
    const req: any = {
      method: 'POST',
      headers: context?.req?.headers,
    }
    // const res = new ServerResponse({...req})
    const res = httpMocks.createResponse({ eventEmitter: EventEmitter, req: {...req} })
    // const res = context?.res
    const cookies = cookie.parse(context.req?.headers?.cookie || '')

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
