import type { ClientHttp2Stream } from 'node:http2';
import type { CustomRequestEventHandler } from '../CustomRequestEventHandler';

/**
 * Interface for custom event handlers that handle `data` events.
 */
export interface CustomDataEventHandler extends CustomRequestEventHandler {
  /**
   * Handles the `data` event.
   *
   * @param chunk The chunk of data
   */
  handle: (request: ClientHttp2Stream, chunk: Buffer) => void;
}
