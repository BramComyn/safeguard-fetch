import type { ClientHttp2Session, Settings } from 'node:http2';
import type { ClientEventHandler } from '../ClientEventHandler';

/**
 * Interface for custom client event handlers that listen to the 'remoteSettings' event.
 */
export interface RemoteSettingsEventHandler extends ClientEventHandler<'remoteSettings'> {
  handle: (client: ClientHttp2Session, remoteSettings: Settings) => void;
}
