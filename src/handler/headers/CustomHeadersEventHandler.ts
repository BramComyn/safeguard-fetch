import type { ClientHttp2Stream, IncomingHttpHeaders } from 'node:http2';
import type { CustomRequestEventHandler } from '../CustomRequestEventHandler';

/**
 * Interface for custom event handlers that handle `response` events.
 */
export interface CustomHeadersEventHandler extends CustomRequestEventHandler {
  /**
   * Handles the `response` event for the request stream.
   *
   * @param request - the request stream that listened to the event
   * @param headers - the headers that were responded
   * @param flags - the flags that were responded
   */
  handle: (
    request: ClientHttp2Stream,
    headers: IncomingHttpHeaders,
    flags: number
  ) => void;
}
