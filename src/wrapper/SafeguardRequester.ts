import type {
  ClientHttp2Session,
  ClientHttp2Stream,
  ClientSessionOptions,
  ClientSessionRequestOptions,
  OutgoingHttpHeaders,
  SecureClientSessionOptions,
} from 'node:http2';

import { connect } from 'node:http2';
import type { Socket } from 'node:net';
import type { TLSSocket } from 'node:tls';

import type { ClientEventHandler } from '../handler/ClientEventHandler';
import type { RequestEventHandler } from '../handler/RequestEventHandler';
import type { Http2ClientEvent, Http2RequestEvent } from '../handler/eventConstants';

type ClientEventHandlerMap = {[K in Http2ClientEvent]?: ClientEventHandler<K>[] };
type RequestEventHandlerMap = {[K in Http2RequestEvent]?: RequestEventHandler<K>[] };

/**
 * A class that wraps around the `http2` module to provide a custom request function
 * that connects to the authority and returns the request stream, while attaching the necessary handlers up front.
 *
 * @member redirectHandlers - handlers for redirect responses
 * @member contentLengthHandlers - handlers for responses with content length
 * @member noContentLengthHandlers - handlers for responses without content length header
 * @method requestOnNew - custom request function that connects to the authority and returns the request stream
 * @method requestOnExisting - custom request function that initiates a new request stream on an existing session
 * @method addHandler - adds a handler to the list of handlers that will be attached to the request stream
 */
export class SafeguardRequester {
  public constructor(
    protected clientEventHandlers: ClientEventHandlerMap = {},
    protected requestEventHandlers: RequestEventHandlerMap = {},
  ) {}

  /**
   * Connects to the authority and returns a new `ClientHttp2Session`.
   * Attaches the necessary handlers up front.
   *
   * @param authority - the authority server to connect to
   * @param sessionOptions - necessary HTTP2 session options
   * @param listener - one-time listener on the `connect` event
   *
   * @returns - a new `ClientHttp2Session`
   */
  public connect(
    authority: string | URL,
    sessionOptions?: ClientSessionOptions | SecureClientSessionOptions,
    listener?: (session: ClientHttp2Session, socket: Socket | TLSSocket) => void,
  ): ClientHttp2Session {
    const client = connect(authority, sessionOptions, listener);
    this.setClientEventHandlers(client);
    return client;
  }

  /**
   * Custom request function that connects to the authority and returns the request stream,
   * while attaching the necessary handlers up front.
   *
   * @param configuration - configuration for the request
   * @param configuration.authority - authority to connect to
   * @param configuration.sessionOptions - options for the session
   * @param configuration.listener - one-time listener on the `connect` event
   * @param configuration.requestHeaders - headers to send with the request
   * @param configuration.requestOptions - options for the request
   *
   * @returns - a new `ClientHttp2Session`
   */
  public connectAndRequest(configuration: {
    authority: string | URL;
    sessionOptions?: ClientSessionOptions | SecureClientSessionOptions;
    listener?: (session: ClientHttp2Session, socket: Socket | TLSSocket) => void;
    requestHeaders?: OutgoingHttpHeaders;
    requestOptions?: ClientSessionRequestOptions;
  }): ClientHttp2Stream {
    const client = this.connect(configuration.authority, configuration.sessionOptions, configuration.listener);
    return this.request(client, configuration.requestHeaders, configuration.requestOptions);
  }

  /**
   * Custom request function that initiates a new request stream on an existing session.
   * while attaching the necessary handlers up front.
   *
   * @param session - the session to initiate the request on
   *
   * @returns - a new `ClientHttp2Stream`
   */
  public request(
    session: ClientHttp2Session,
    requestHeaders?: OutgoingHttpHeaders,
    requestOptions?: ClientSessionRequestOptions,
  ): ClientHttp2Stream {
    const request = session.request(requestHeaders, requestOptions);
    this.setRequestEventHandlers(request);
    return request;
  }

  /**
   * Sets all the necessary event handlers on the client session.
   *
   * TODO [2024-09-13]: Test this
   *
   * @param client - the client session to add the handlers to
   */
  private setClientEventHandlers(client: ClientHttp2Session): void {
    for (const [ event, handlers ] of Object.entries(this.clientEventHandlers)) {
      if (handlers) {
        for (const handler of handlers) {
          client.on(event, (...args): void => {
            // Prevent the linter from burning me at the stake
            // eslint-disable-next-line ts/no-unsafe-call, ts/no-explicit-any, ts/no-unsafe-member-access
            (handler as any).handle(client, ...args);
          });
        }
      }
    }
  }

  /**
   * Sets all the necessary event handlers on the request stream.
   *
   * TODO [2024-09-13]: Test this
   *
   * @param request - the request stream to add the handlers to
   */
  private setRequestEventHandlers(request: ClientHttp2Stream): void {
    for (const [ event, handlers ] of Object.entries(this.requestEventHandlers)) {
      if (handlers) {
        for (const handler of handlers) {
          request.on(event, (...args): void => {
            // eslint-disable-next-line ts/no-unsafe-argument
            handler.handle(request, ...args);
          });
        }
      }
    }
  }
}
