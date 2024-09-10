import type { ClientHttp2Stream, IncomingHttpHeaders } from 'node:http2';

/**
 * This redirect handler will the request if it is redirected to a banned URL.
 *
 * @param request - The request stream.
 * @param headers - The headers of the redirect response.
 * @param banned - The list of banned URLs.
 */
function detectBannedRedirect(
  request: ClientHttp2Stream,
  headers: IncomingHttpHeaders,
  banned: string[],
): void {
  const location = headers.location;
  if (location && banned.includes(location)) {
    request.close();
  }
}

/**
 * This redirect handler will only allow the request if it is redirected to a whitelisted URL.
 *
 * @param request - The request stream.
 * @param headers - The headers of the redirect response.
 */
function detectWhitelistedRedirect(
  request: ClientHttp2Stream,
  headers: IncomingHttpHeaders,
  allowed: string[],
): void {
  const location = headers.location;
  if (location && !allowed.includes(location)) {
    request.close();
  }
}

/**
 * Creates a redirect handler that will close the request if it is redirected to a banned URL.
 *
 * @param banned - The list of banned URLs.
 *
 * @returns - A redirect handler that will close the request if it is redirected to a banned URL.
 */
export function createBannedRedirectHandler(banned: string[]):
(request: ClientHttp2Stream, headers: IncomingHttpHeaders) => void {
  return (request: ClientHttp2Stream, headers: IncomingHttpHeaders): void => {
    detectBannedRedirect(request, headers, banned);
  };
}

/**
 * Creates a redirect handler that will close the request if it is redirected to a URL not in the allowed list.
 *
 * @param allowed - The list of allowed URLs.
 *
 * @returns - A redirect handler that will close the request if it is redirected to a URL not in the allowed list.
 */
export function createWhitelistedRedirectHandler(allowed: string[]):
(request: ClientHttp2Stream, headers: IncomingHttpHeaders) => void {
  return (request: ClientHttp2Stream, headers: IncomingHttpHeaders): void => {
    detectWhitelistedRedirect(request, headers, allowed);
  };
}
