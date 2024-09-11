import type { ClientHttp2Stream } from 'node:http2';
import type { CustomRequestEventHandler } from '../CustomRequestEventHandler';

/**
 * Interface for custom event handlers that handle the `continue` event.
 */
export interface CustomContinueEventHandler extends CustomRequestEventHandler<'continue'> {
  handle: (request: ClientHttp2Stream) => void;
}
