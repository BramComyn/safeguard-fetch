import type { ClientHttp2Stream, IncomingHttpHeaders } from 'node:http2';
import type { CustomResponseEventHandler } from './CustomResponseEventHandler';

/**
 * A handler that refuses the request if the content length is not provided.
 */
export class RefuseNoContentLengthHandler implements CustomResponseEventHandler {
  public handle(request: ClientHttp2Stream, headers: IncomingHttpHeaders): void {
    if (!headers['content-length']) {
      request.close();
    }
  }
}
