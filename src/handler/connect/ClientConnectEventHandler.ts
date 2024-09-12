import type { ClientHttp2Session } from 'node:http2';
import type { Socket } from 'node:net';
import type { TLSSocket } from 'node:tls';

import type { ClientEventHandler } from '../ClientEventHandler';

/**
 * Interface for custom client event handlers that listen to the 'connect' event.
 */
export interface ClientConnectEventHandler extends ClientEventHandler<'connect'> {
  handle: (client: ClientHttp2Session, session: ClientHttp2Session, socket: Socket | TLSSocket) => void;
}
