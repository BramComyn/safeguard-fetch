import type { ClientHttp2Stream } from 'node:http2';
import type { CustomRequestEventHandler } from './CustomRequestEventHandler';

/**
 * Interface for custom event handlers that handle events which don't
 * provide any extra information for request streams.
 *
 * Used for the following events:
 * `close`, `timeout`, `aborted`, `ready`, `wantTrailers` and `continue`.
 */
export interface CustomRequestEventWithoutExtraInformationHandler extends CustomRequestEventHandler {
  handle: (request: ClientHttp2Stream) => void;
}
