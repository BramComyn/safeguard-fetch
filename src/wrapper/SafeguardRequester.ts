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

export type ClientEventHandlerMap = {[K in keyof Http2ClientEvent]?: ClientEventHandler<K>[] };
export type RequestEventHandlerMap = {[K in keyof Http2RequestEvent]?: RequestEventHandler<K>[] };

/**
 * A class that wraps around the `http2` module to provide a custom request function
 * that connects to the authority and returns the request stream, while attaching the necessary handlers up front.
 *
 * @member clientEventHandlers - a map of event handlers for the client session
 * @member requestEventHandlers - a map of event handlers for the request stream
 * @method connect - connects to the authority and returns a new `ClientHttp2Session`
 * @method connectAndRequest - connects to the authority, initiates a new request on the given path
 *  and returns a new `ClientHttp2Stream`
 * @method request - initiates a new request stream on an existing session and returns a new `ClientHttp2Stream`.
 * @method setClientEventHandlers - sets the necessary event handlers on the client session
 * @method setRequestEventHandlers - sets the necessary event handlers on the request stream
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
   * @param requestHeaders - headers to send with the request
   * @param requestOptions - options for the request
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
   * @param client - the client session to add the handlers to
   */
  private setClientEventHandlers(client: ClientHttp2Session): void {
    for (const [ event, handlers ] of Object.entries(this.clientEventHandlers)) {
      if (handlers) {
        for (const handler of handlers) {
          client.on(event, (...args): void => {
            // Prevent the linter from burning me at the stake
            // eslint-disable-next-line ts/no-unsafe-call, ts/no-explicit-any
            (handler as any)(client, ...args);
          });
        }
      }
    }
  }

  /**
   * Sets all the necessary event handlers on the request stream.
   *
   * @param request - the request stream to add the handlers to
   */
  private setRequestEventHandlers(request: ClientHttp2Stream): void {
    for (const [ event, handlers ] of Object.entries(this.requestEventHandlers)) {
      if (handlers) {
        for (const handler of handlers) {
          request.on(event, (...args): void => {
            // Prevent the linter from burning me at the stake
            // eslint-disable-next-line ts/no-unsafe-call, ts/no-explicit-any
            (handler as any)(request, ...args);
          });
        }
      }
    }
  }

  /**
   * Adds a new client event handler to the map
   * important: this does not add the handler to any previously created client sessions
   *
   * @param event - the event to add the handler to
   * @param handler - the handler to add
   */
  public addClientEventHandler<K extends keyof Http2ClientEvent>(event: K, handler: ClientEventHandler<K>): void {
    if (!this.clientEventHandlers[event]) {
      this.clientEventHandlers[event] = [];
    }

    this.clientEventHandlers[event]?.push(handler);
  }

  /**
   * Adds a new request event handler to the map
   * important: this does not set the listener on any previously created request streams.
   *
   * @param event - the event to add the handler to
   * @param handler - the handler to add
   */
  public addRequestEventHandler<K extends keyof Http2RequestEvent>(event: K, handler: RequestEventHandler<K>): void {
    if (!this.requestEventHandlers[event]) {
      this.requestEventHandlers[event] = [];
    }

    this.requestEventHandlers[event]?.push(handler);
  }

  /**
   * Clears all client event handlers from the map
   * important: this does not remove the handler from any previously created client sessions
   */
  public clearClientEventHandlers(): void {
    this.clientEventHandlers = {};
  }

  /**
   * Clears all request event handlers from the map
   * important: this does not remove the handler from any previously created request streams
   */
  public clearRequestEventHandlers(): void {
    this.requestEventHandlers = {};
  }
}
