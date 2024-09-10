import type { ClientHttp2Stream, IncomingHttpHeaders } from 'node:http2';

/**
 * This request handler will close the request if the content length is longer than the maximum length.
 *
 * @param request - The request stream.
 * @param headers - The headers of the request.
 * @param maxLength - The maximum allowed content length.
 */
function refuseContentLengthLongerThan(
  request: ClientHttp2Stream,
  headers: IncomingHttpHeaders,
  maxLength: number,
): void {
  const contentLength = headers['content-length'];
  if (contentLength && Number.parseInt(contentLength, 10) > maxLength) {
    request.close();
  }
}

/**
 * This request handler will close the request if the content length is not provided.
 *
 * @param request - The request stream.
 * @param headers - The headers of the request.
 */
function refuseNoContentLength(
  request: ClientHttp2Stream,
  headers: IncomingHttpHeaders,
): void {
  if (!headers['content-length']) {
    request.close();
  }
}

/**
 * Creates a request handler that will close the request if the content length is longer than the maximum length.
 *
 * @param maxLength - The maximum allowed content length.
 *
 * @returns - A request handler that will close the request if the content length is longer than the maximum length.
 */
export function createContentLengthHandler(maxLength: number):
(request: ClientHttp2Stream, headers: IncomingHttpHeaders) => void {
  return (request: ClientHttp2Stream, headers: IncomingHttpHeaders): void => {
    refuseContentLengthLongerThan(request, headers, maxLength);
  };
}

/**
 * Creates a request handler that will close the request if the content length is not provided.
 *
 * @returns - A request handler that will close the request if the content length is not provided.
 */
export function createNoContentLengthHandler():
(request: ClientHttp2Stream, headers: IncomingHttpHeaders) => void {
  return (request: ClientHttp2Stream, headers: IncomingHttpHeaders): void => {
    refuseNoContentLength(request, headers);
  };
}
