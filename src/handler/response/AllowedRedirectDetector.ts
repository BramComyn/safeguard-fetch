import type { ClientHttp2Stream, IncomingHttpHeaders } from 'node:http2';
import type { CustomResponseEventHandler } from './CustomResponseEventHandler';

/**
 * Creates a redirect handler that will close the request if it is redirected to a URL not in the allowed list.
 */
export class AllowedRedirectDetector implements CustomResponseEventHandler {
  public constructor(private readonly allowed: string[]) {}

  public async handle(request: ClientHttp2Stream, headers: IncomingHttpHeaders): void {
    const status = Number.parseInt(headers[':status'] as string | undefined ?? '0', 10);
    if (status !== 0 && status >= 300 && status < 400) {
      const location = headers.location;
      if (location && !this.allowed.includes(location)) {
        request.close();
      }
    }
  }
}
