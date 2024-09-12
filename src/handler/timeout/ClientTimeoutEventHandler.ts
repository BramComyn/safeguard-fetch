import type { ClientHttp2Session } from 'node:http2';
import type { ClientEventHandler } from '../ClientEventHandler';

/**
 * Interface for custom client event handlers that handle the `timeout` event.
 */
export interface ClientTimeoutEventHandler extends ClientEventHandler<'timeout'> {
  handle: (client: ClientHttp2Session) => void;
}
