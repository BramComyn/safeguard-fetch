import type { ClientHttp2Session, Http2Stream, OutgoingHttpHeaders } from 'node:http2';
import type { ClientEventHandler } from '../ClientEventHandler';

/**
 * Interface for custom client event handlers that listen to the 'stream' event.
 */
export interface StreamEventHandler extends ClientEventHandler<'stream'> {
  handle: (
    client: ClientHttp2Session,
    stream: Http2Stream,
    headers: OutgoingHttpHeaders,
    flags: number,
    rawHeaders: (string | Buffer)[]
  ) => void;
}
