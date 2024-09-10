import type { ClientHttp2Stream, IncomingHttpHeaders } from 'node:http2';
import { once } from 'node:events';

/**
 * Wrapper for the content length of a response.
 * The user can define a callback to handle the content length.
 *
 * @param request - The request stream.
 * @param contentLengthHandler - callback to handle the content length.
 */
export async function setContentLengthHandler(
  request: ClientHttp2Stream,
  contentLengthHandler: (request: ClientHttp2Stream, headers: IncomingHttpHeaders) => void,
): Promise<void> {
  /**
   * We have to use this `await once(...)`,
   * because otherwise it would be possible that the request is already closed
   * by the time we try to read the headers and handle them.
   */
  const responseHeaders: IncomingHttpHeaders = (await once(request, 'response'))[0] as IncomingHttpHeaders;
  const contentLengthString: string | undefined = responseHeaders['content-length'];

  if (contentLengthString !== undefined) {
    contentLengthHandler(request, responseHeaders);
  }
}

/**
 * Wrapper for the lack of content length in a response.
 * The user can define a callback to handle the lack of content length.
 *
 * @param request - The request stream.
 * @param noContentLengthHandler - callback to handle the lack of content length.
 */
export async function setNoContentLengthHandler(
  request: ClientHttp2Stream,
  noContentLengthHandler: (request: ClientHttp2Stream, headers: IncomingHttpHeaders) => void,
): Promise<void> {
  /**
   * We have to use this `await once(...)`,
   * because otherwise it would be possible that the request is already closed
   * by the time we try to read the headers and handle them.
   */
  const responseHeaders: IncomingHttpHeaders = (await once(request, 'response'))[0] as IncomingHttpHeaders;
  const contentLengthString: string | undefined = responseHeaders['content-length'];

  if (contentLengthString === undefined) {
    noContentLengthHandler(request, responseHeaders);
  }
}
