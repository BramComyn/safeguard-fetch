import type { ClientHttp2Stream, IncomingHttpHeaders } from 'node:http2';
import type { ResponseEventHandler } from '../RequestEventHandler';

/**
 * Creates a redirect handler that will close the request if it is redirected to a URL not in the allowed list.
 *
 * @param allowed - The list of allowed URLs.
 *
 * @returns - The response event handler.
 */
export function createAllowedRedirectDetector(allowed: string[]): ResponseEventHandler {
  return (request: ClientHttp2Stream, headers: IncomingHttpHeaders): void => {
    const status = Number.parseInt(headers[':status'] as string | undefined ?? '0', 10);
    if (status !== 0 && status >= 300 && status < 400) {
      const location = headers.location;
      if (location && !allowed.includes(location)) {
        request.close();
      }
    }
  };
}
