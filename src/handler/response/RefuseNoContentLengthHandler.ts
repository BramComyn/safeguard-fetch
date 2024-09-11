import type { ClientHttp2Stream, IncomingHttpHeaders } from 'node:http2';
import type { ResponseEventHandler } from './ResponseEventHandler';

/**
 * A handler that refuses the request if the content length is not provided.
 */
export class RefuseNoContentLengthHandler implements ResponseEventHandler {
  public handle(request: ClientHttp2Stream, headers: IncomingHttpHeaders): void {
    if (!headers['content-length']) {
      request.close();
    }
  }
}
