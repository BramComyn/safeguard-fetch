import type { ClientHttp2Stream } from 'node:http2';
import type { RequestEventHandler } from '../RequestEventHandler';
import type { Http2RequestEventArgumentTypes } from '../eventConstants';

/**
 * Interface for custom event handlers that handle `response` events.
 */
export interface HeadersEventHandler<K extends 'headers' | 'trailers' | 'push' | 'response'>
  extends RequestEventHandler<'headers' | 'trailers' | 'push' | 'response'> {
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
