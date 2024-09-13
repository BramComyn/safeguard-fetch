import type { ClientHttp2Stream, IncomingHttpHeaders } from 'node:http2';
import type { ResponseEventHandler } from '../RequestEventHandler';

/**
 * Creates handler that refuses the request if the content length is not provided.
 *
 * @returns - The response event handler.
 */
export function createRefuseNoContentLengthHandler(): ResponseEventHandler {
  return (request: ClientHttp2Stream, headers: IncomingHttpHeaders): void => {
    if (!headers['content-length']) {
      request.close();
    }
  };
}
