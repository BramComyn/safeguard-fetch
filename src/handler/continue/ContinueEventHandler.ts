import type { ClientHttp2Stream } from 'node:http2';
import type { RequestEventHandler } from '../RequestEventHandler';

/**
 * Interface for custom event handlers that handle the `continue` event.
 */
export interface ContinueEventHandler extends RequestEventHandler<'continue'> {
  handle: (request: ClientHttp2Stream) => void;
}
