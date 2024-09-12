import type { ClientHttp2Session } from 'node:http2';
import type { ClientEventHandler } from '../ClientEventHandler';

/**
 * Interface for custom client event handlers that listen to the 'altsvc' event.
 */
export interface AltsvcEventHandler extends ClientEventHandler<'altsvc'> {
  handle: (client: ClientHttp2Session, alt: string, origin: string, streamID: number) => void;
}
