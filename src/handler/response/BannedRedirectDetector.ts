import type { ClientHttp2Stream, IncomingHttpHeaders } from 'node:http2';
import type { ResponseEventHandler } from '../RequestEventHandler';

/**
 * Creates a redirect handler that will close the request if it is redirected to a banned URL.
 */
export class BannedRedirectDetector {
  public constructor(protected readonly banned: string[]) {}

  public handle: ResponseEventHandler = (request: ClientHttp2Stream, headers: IncomingHttpHeaders): void => {
    const status = Number.parseInt(headers[':status'] as string | undefined ?? '0', 10);
    if (status !== 0 && status >= 300 && status < 400) {
      const location = headers.location;
      if (location && this.banned.includes(location)) {
        request.close();
      }
    } else if (status === 0) {
      request.close();
    }
  };
}
