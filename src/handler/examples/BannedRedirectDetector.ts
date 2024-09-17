import type { ClientHttp2Stream, IncomingHttpHeaders } from 'node:http2';
import type { ResponseEventHandler } from '../RequestEventHandler';
import { getStatusCode, isRedirection } from '../../util';

/**
 * Creates a redirect handler that will close the request if it is redirected to a banned URL.
 *
 * @param banned - The list of banned URLs.
 *
 * @returns - The response event handler.
 */
export function createBannedRedirectDetector(banned: string[]): ResponseEventHandler {
  return (request: ClientHttp2Stream, headers: IncomingHttpHeaders): void => {
    const status = getStatusCode(headers);
    if (isRedirection(status)) {
      const location = headers.location;
      if (location && banned.includes(location) && !request.closed) {
        request.close();
      }
    }
  };
}
