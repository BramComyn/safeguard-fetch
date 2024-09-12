import type { ClientHttp2Session } from 'node:http2';
import type { ClientEventHandler } from '../ClientEventHandler';

/**
 * Interface for custom client event handlers that listen to the 'origin' event.
 */
export interface OriginEventHandler extends ClientEventHandler<'origin'> {
  handle: (client: ClientHttp2Session, origins: string[]) => void;
}
