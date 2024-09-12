import type { ClientHttp2Stream } from 'node:http2';
import type { RequestEventHandler } from '../RequestEventHandler';

/**
 * Interface for custom event handlers that handle the `close` event.
 */
export interface RequestCloseEventHandler extends RequestEventHandler<'close'> {
  handle: (request: ClientHttp2Stream) => void;
}
