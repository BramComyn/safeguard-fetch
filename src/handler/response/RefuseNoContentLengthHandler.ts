import type { ClientHttp2Stream, IncomingHttpHeaders } from 'node:http2';
import type { ResponseEventHandler } from '../RequestEventHandler';
import { getStatusCode, isSuccessful } from '../../util';

/**
 * Creates handler that refuses the request if the content length is not provided.
 *
 * @returns - The response event handler.
 */
export function createRefuseNoContentLengthHandler(): ResponseEventHandler {
  return (request: ClientHttp2Stream, headers: IncomingHttpHeaders): void => {
    const status = getStatusCode(headers);
    if (isSuccessful(status) && !headers['content-length']) {
      request.close();
    }
  };
}
