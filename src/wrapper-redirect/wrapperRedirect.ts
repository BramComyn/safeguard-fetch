import type { ClientHttp2Session, ClientHttp2Stream, IncomingHttpHeaders, OutgoingHttpHeaders } from 'node:http2';
import { once } from 'node:events';

/**
 * Wrapper for request that prohibits redirects to a certain list of hostnames.
 *
 * @param client - HTTP/2 client session.
 * @param headers - Headers to send with the request.
 * @param options - Options to pass to the request.
 * @param banList - List of hostnames to prohibit redirects to.
 *
 * @returns The request stream.
 *
 * @throws [Error](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) when a redirect is detected to a hostname in the ban list.
 */
export async function wrapperRedirect(
  client: ClientHttp2Session,
  headers: OutgoingHttpHeaders,
  options: object,
  banList: string[],
): Promise<ClientHttp2Stream> {
  const req = client.request(headers, options);

  const responseHeaders: IncomingHttpHeaders = (await once(req, 'response'))[0] as IncomingHttpHeaders;
  const status = Number.parseInt(responseHeaders[':status'] as string | undefined ?? '0', 10);

  if (status !== 0 && status >= 300 && status < 400) {
    const location = responseHeaders.location as string;
    const redirectHostname = new URL(location).hostname;

    if (banList.includes(redirectHostname)) {
      throw new Error(`Redirecting to ${redirectHostname} is prohibited.`);
    }
  }

  return req;
}
