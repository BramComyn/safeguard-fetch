import type { ClientHttp2Session } from 'node:http2';
import type { ClientEventHandler } from '../ClientEventHandler';

/**
 * Interface for custom client event handlers that listen to the 'frameError' event.
 */
export interface ClientFrameErrorEventHandler extends ClientEventHandler<'frameError'> {
  handle: (client: ClientHttp2Session, type: number, code: number, id: number) => void;
}
