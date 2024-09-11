import type { ClientHttp2Stream } from 'node:http2';
import type { CustomRequestEventHandler } from '../CustomRequestEventHandler';

/**
 * Interface for custom event handlers that handle the `wantTrailers` event.
 */
export interface CustomWantTrailersEventHandler extends CustomRequestEventHandler<'wantTrailers'> {
  handle: (request: ClientHttp2Stream) => void;
}
