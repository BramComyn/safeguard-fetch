import type { ClientHttp2Stream } from 'node:http2';
import type { CustomRequestEventHandler } from '../CustomRequestEventHandler';

/**
 * Interface for custom event handlers that handle the `aborted` event.
 */
export interface CustomAbortedEventHandler extends CustomRequestEventHandler<'aborted'> {
  handle: (request: ClientHttp2Stream) => void;
}
