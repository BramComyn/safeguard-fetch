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

import type { CustomRequestEventHandler } from '../handler/CustomRequestEventHandler';
import type { Http2RequestEventKeys, Http2RequestEventTypes } from '../attack-server/attackServerConstants';
import { HTTP2_REQUEST_EVENTS } from '../attack-server/attackServerConstants';

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
    // TODO [2024-09-11]: add type
    // private clientEventHandlers: any[] = [],
    private readonly requestEventHandlers: Partial<Record<Http2RequestEventKeys, CustomRequestEventHandler[]>> = {},
  ) {}

  /**
   * Custom request function that connects to the authority and returns the request stream,
   * while attaching the necessary handlers up front.
   *
   * @param authority - authority to connect to
   * @param sessionOptions - options for the session
   * @param listener - one-time listener on the `connect` event
   * @param requestHeaders - headers to send with the request
   * @param requestOptions - options for the request
   *
   * @returns - a new `ClientHttp2Session`
   */
  public async requestOnNew(
    authority: string | URL,
    sessionOptions?: ClientSessionOptions | SecureClientSessionOptions,
    listener?: (session: ClientHttp2Session, socket: Socket | TLSSocket) => void,
    requestHeaders?: OutgoingHttpHeaders,
    requestOptions?: ClientSessionRequestOptions,
  ): Promise<ClientHttp2Stream> {
    const client = connect(authority, sessionOptions, listener);

    // TODO [2024-09-13]: Add session handlers

    return this.requestOnExisting(client, requestHeaders, requestOptions);
  }

  /**
   * Custom request function that initiates a new request stream on an existing session.
   * while attaching the necessary handlers up front.
   *
   * @param session - the session to initiate the request on
   *
   * @returns - a new `ClientHttp2Stream`
   */
  public async requestOnExisting(
    session: ClientHttp2Session,
    requestHeaders?: OutgoingHttpHeaders,
    requestOptions?: ClientSessionRequestOptions,
  ): Promise<ClientHttp2Stream> {
    const request = session.request(requestHeaders, requestOptions);
    await this.setRequestEventHandlers(request);
    return request;
  }

  /**
   * Sets all the necessary event handlers on the request stream.
   *
   * TODO [2024-09-11]: Test this
   *
   * @param request - the request stream to add the handlers to
   */
  private async setRequestEventHandlers(request: ClientHttp2Stream): Promise<void> {
    // For all possible events
    for (const event of HTTP2_REQUEST_EVENTS) {
      // Set all the handlers for that event, specifying the event type instead of using any
      request.on(event, (...args: Http2RequestEventTypes[typeof event]): void => {
        for (const handler of this.requestEventHandlers[event] ?? []) {
          handler.handle(request, ...args);
        }
      });
    }
  }
}
