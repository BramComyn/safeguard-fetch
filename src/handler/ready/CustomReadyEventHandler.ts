import type { ClientHttp2Stream } from 'node:http2';
import type { CustomRequestEventHandler } from '../CustomRequestEventHandler';

/**
 * Interface for custom event handlers that handle the `ready` event.
 */
export interface CustomReadyEventHandler extends CustomRequestEventHandler<'ready'> {
  handle: (request: ClientHttp2Stream) => void;
}
