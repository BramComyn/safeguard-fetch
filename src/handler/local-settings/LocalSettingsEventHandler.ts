import type { ClientHttp2Session, Settings } from 'node:http2';
import type { ClientEventHandler } from '../ClientEventHandler';

/**
 * Interface for custom client event handlers that listen to the 'localSettings' event.
 */
export interface LocalSettingsEventHandler extends ClientEventHandler<'localSettings'> {
  handle: (client: ClientHttp2Session, localSettings: Settings) => void;
}
