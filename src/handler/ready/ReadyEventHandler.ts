import type { ClientHttp2Stream } from 'node:http2';
import type { RequestEventHandler } from '../RequestEventHandler';

/**
 * Interface for custom event handlers that handle the `ready` event.
 */
export interface ReadyEventHandler extends RequestEventHandler<'ready'> {
  handle: (request: ClientHttp2Stream) => void;
}
