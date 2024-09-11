import type { ClientHttp2Stream } from 'node:http2';
import type { RequestEventHandler } from '../RequestEventHandler';

/**
 * Interface for custom event handlers that handle the `wantTrailers` event.
 */
export interface WantTrailersEventHandler extends RequestEventHandler<'wantTrailers'> {
  handle: (request: ClientHttp2Stream) => void;
}
