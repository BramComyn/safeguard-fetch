import type { ClientHttp2Stream } from 'node:http2';
import type { Http2RequestEventKeys, Http2RequestEventTypes } from '../attack-server/attackServerConstants';

/**
 * Interface for any of the custom event handlers.
 * Most generic interface.
 */
export interface CustomRequestEventHandler {
  /**
   * Handles the request stream and the headers that were responded.
   *
   * @param request - the client session or request stream that listened to the event
   * @param args - the arguments provided to the handler via the event
   */
  handle: (
    request: ClientHttp2Stream,
    ...args: Http2RequestEventTypes[Http2RequestEventKeys][]
  ) => void;
}
