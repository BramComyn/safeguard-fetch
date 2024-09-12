import type { ClientHttp2Session } from 'node:http2';
import type { ClientEventHandler } from '../ClientEventHandler';

/**
 * Interface for custom client event handlers that listen to the 'goaway' event.
 */
export interface GoawayEventHandler extends ClientEventHandler<'goaway'> {
  handle: (client: ClientHttp2Session, errorCode: number, lastStreamID: number, opaqueData: Buffer) => void;
}
