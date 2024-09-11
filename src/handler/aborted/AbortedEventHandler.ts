import type { ClientHttp2Stream } from 'node:http2';
import type { RequestEventHandler } from '../RequestEventHandler';

/**
 * Interface for custom event handlers that handle the `aborted` event.
 */
export interface AbortedEventHandler extends RequestEventHandler<'aborted'> {
  handle: (request: ClientHttp2Stream) => void;
}
