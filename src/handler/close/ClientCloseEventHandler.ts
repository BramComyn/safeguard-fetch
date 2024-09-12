import type { ClientHttp2Session } from 'node:http2';
import type { ClientEventHandler } from '../ClientEventHandler';

/**
 * Interface for custom client event handlers that listen to the 'close' event.
 */
export interface ClientCloseEventHandler extends ClientEventHandler<'close'> {
  handle: (client: ClientHttp2Session) => void;
}
