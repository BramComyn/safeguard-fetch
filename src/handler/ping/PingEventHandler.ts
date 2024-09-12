import type { ClientHttp2Session } from 'node:http2';
import type { ClientEventHandler } from '../ClientEventHandler';

/**
 * Interface for custom client event handlers that listen to the 'ping' event.
 */
export interface PingEventHandler extends ClientEventHandler<'ping'> {
  handle: (client: ClientHttp2Session, buffer: Buffer) => void;
}
