import type { ClientHttp2Stream } from 'node:http2';
import type { CustomRequestEventHandler } from '../CustomRequestEventHandler';

/**
 * Interface for custom event handlers that handle the `timeout` event.
 */
export interface CustomRequestTimeoutEventHandler extends CustomRequestEventHandler<'timeout'> {
  handle: (request: ClientHttp2Stream) => void;
}
