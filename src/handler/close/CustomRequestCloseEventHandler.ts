import type { ClientHttp2Stream } from 'node:http2';
import type { CustomRequestEventHandler } from '../CustomRequestEventHandler';

/**
 * Interface for custom event handlers that handle the `close` event.
 */
export interface CustomRequestCloseEventHandler extends CustomRequestEventHandler<'close'> {
  handle: (request: ClientHttp2Stream) => void;
}
