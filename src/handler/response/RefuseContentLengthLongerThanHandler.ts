import type { ClientHttp2Stream, IncomingHttpHeaders } from 'node:http2';
import type { CustomResponseEventHandler } from './CustomResponseEventHandler';

/**
 * A handler that refuses the request if the content length is longer than the maximum length.
 */
export class RefuseContentLongerThanHandler implements CustomResponseEventHandler {
  public constructor(private readonly maxLength: number) {}

  public handle(request: ClientHttp2Stream, headers: IncomingHttpHeaders): void {
    const contentLength = headers['content-length'];
    if (contentLength && Number.parseInt(contentLength, 10) > this.maxLength) {
      request.close();
    }
  }
}
