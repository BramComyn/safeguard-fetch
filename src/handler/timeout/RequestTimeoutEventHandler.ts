import type { ClientHttp2Stream } from 'node:http2';
import type { RequestEventHandler } from '../RequestEventHandler';

/**
 * Interface for custom event handlers that handle the `timeout` event.
 */
export interface RequestTimeoutEventHandler extends RequestEventHandler<'timeout'> {
  handle: (request: ClientHttp2Stream) => void;
}
