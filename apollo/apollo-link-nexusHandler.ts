import { ApolloLink, Operation, FetchResult, Observable } from '@apollo/client';
import {ClientRequest, ServerResponse} from 'http'

export namespace NexusHandler {
  export type NexusHandlerFunction = (
    req: ClientRequest, res: ServerResponse
  ) => Record<string, any>;

  export interface Options {
    /**
     * The nexus graphQL handler to generate responses from.
     */
    handler: any;

    /**
     * A request object.
     */
    req?: ClientRequest;

    /**
     * The response from the nexus handler.
     */
    res?: ServerResponse | Record<string, any>;
  }
}

export class NexusHandler extends ApolloLink {
  public handler: NexusHandler.NexusHandlerFunction | any;;
  public req: any;
  public res: ServerResponse | any;

  constructor({ handler, req, res }: NexusHandler.Options) {
    super();

    this.handler = handler;
    this.req = req;
    this.res = res;
  }

  public request({query, variables}: Operation): Observable<FetchResult> | null {
  return new Observable<FetchResult>(observer => {
    this.req.body = {query, variables}
      Promise.resolve(
        this.handler(
          this.req,
          this.res
        ),
      )
        .then(() => {
          if (!observer.closed) {
            observer.next(this.res.body);
            observer.complete();
          }
        })
        .catch(error => {
          if (!observer.closed) {
            observer.error(error);
          }
        });
    });
  }
}

export default NexusHandler;