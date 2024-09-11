import type { ClientHttp2Stream } from 'node:http2';
import type { CustomRequestEventHandler } from '../CustomRequestEventHandler';

/**
 * Interface for custom event handlers that handle `error` events for request streams.
 */
export interface CustomRequestErrorEventHandler extends CustomRequestEventHandler<'error'> {
  /**
   * Handles the error event for a request stream.
   *
   * @param request - The request stream.
   * @param error - The error that occurred.
   */
  handle: (request: ClientHttp2Stream, error: Error) => void;
}
