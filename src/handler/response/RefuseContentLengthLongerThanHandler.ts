import type { ClientHttp2Stream, IncomingHttpHeaders } from 'node:http2';
import type { ResponseEventHandler } from '../RequestEventHandler';

/**
 * A handler that refuses the request if the content length is longer than the maximum length.
 */
export class RefuseContentLengthLongerThanHandler {
  public constructor(private readonly maxLength: number) {}

  public handle: ResponseEventHandler = (request: ClientHttp2Stream, headers: IncomingHttpHeaders): void => {
    const contentLength = headers['content-length'];
    if (!contentLength || Number.parseInt(contentLength, 10) > this.maxLength) {
      request.close();
    }
  };
}
