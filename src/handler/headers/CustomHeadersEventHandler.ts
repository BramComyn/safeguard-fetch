import type { ClientHttp2Stream } from 'node:http2';
import type { CustomRequestEventHandler } from '../CustomRequestEventHandler';
import type { Http2RequestEventArgumentTypes } from '../../attack-server/attackServerConstants';

/**
 * Interface for custom event handlers that handle `response` events.
 */
export interface CustomHeadersEventHandler<K extends 'headers' | 'trailers' | 'push' | 'response'>
  extends CustomRequestEventHandler<'headers' | 'trailers' | 'push' | 'response'> {
  /**
   * Handles the `response` event for the request stream.
   *
   * @param request - the request stream that listened to the event
   * @param headers - the headers that were responded
   * @param flags - the flags that were responded
   */
  handle: (
    request: ClientHttp2Stream,
    ...args: Http2RequestEventArgumentTypes[K]
  ) => void;
}
