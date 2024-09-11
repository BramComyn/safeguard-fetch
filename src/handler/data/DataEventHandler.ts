import type { ClientHttp2Stream } from 'node:http2';
import type { RequestEventHandler } from '../RequestEventHandler';

/**
 * Interface for custom event handlers that handle `data` events.
 */
export interface DataEventHandler extends RequestEventHandler<'data'> {
  /**
   * Handles the `data` event.
   *
   * @param chunk The chunk of data
   */
  handle: (request: ClientHttp2Stream, chunk: Buffer) => void;
}
