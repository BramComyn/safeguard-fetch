import type { ClientHttp2Stream, IncomingHttpHeaders } from 'node:http2';
import { once } from 'node:events';

/**
 * Wrapper for requests that result in a redirect status code.
 * The user can define a callback to handle the redirect.
 *
 * @param request - The request stream.
 * @param redirectHandler - callback to handle the redirect.
 *
 * @returns The request stream.
 */
export async function setRedirectHandler(
  request: ClientHttp2Stream,
  redirectHandler: (request: ClientHttp2Stream, headers: IncomingHttpHeaders) => void,
): Promise<ClientHttp2Stream> {
  const responseHeaders: IncomingHttpHeaders = (await once(request, 'response'))[0] as IncomingHttpHeaders;
  const status = Number.parseInt(responseHeaders[':status'] as string | undefined ?? '0', 10);

  if (status !== 0 && status >= 300 && status < 400) {
    redirectHandler(request, responseHeaders);
  }

  return request;
}
