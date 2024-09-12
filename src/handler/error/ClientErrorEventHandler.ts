import type { ClientHttp2Session } from 'node:http2';
import type { ClientEventHandler } from '../ClientEventHandler';

/**
 * Interface for custom client event handlers that listen to the 'error' event.
 */
export interface ClientErrorEventHandler extends ClientEventHandler<'error'> {
  handle: (client: ClientHttp2Session, err: Error) => void;
}
