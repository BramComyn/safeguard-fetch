import type { ClientHttp2Stream } from 'node:http2';
import type { Http2RequestEventArgumentTypes, Http2RequestEvents } from './eventConstants';

/**
 * Interface for any of the custom event handlers.
 * Most generic interface.
 */
export interface RequestEventHandler<K extends Http2RequestEvents> {
  /**
   * Handles the request stream and the headers that were responded.
   *
   * @param request - the client session or request stream that listened to the event
   * @param args - the arguments provided to the handler via the event
   */
  handle: (
    request: ClientHttp2Stream,
    ...args: Http2RequestEventArgumentTypes[K]
  ) => void;
}
