import type { ClientHttp2Stream, IncomingHttpHeaders } from 'node:http2';
import type { ResponseEventHandler } from '../RequestEventHandler';
import { getStatusCode, isSuccessful } from '../../util';

/**
 * Creates a handler that refuses the request if the content length is longer than the maximum length.
 *
 * @param maxLength - The maximum length of the content.
 *
 * @returns - The response event handler.
 */
export function createRefuseContentLongerThanHandler(maxLength: number): ResponseEventHandler {
  return (request: ClientHttp2Stream, headers: IncomingHttpHeaders): void => {
    const contentLength = headers['content-length'];
    const status = getStatusCode(headers);
    if (
      isSuccessful(status) &&
      (!contentLength || Number.parseInt(contentLength, 10) > maxLength)
    ) {
      request.close();
    }
  };
}
