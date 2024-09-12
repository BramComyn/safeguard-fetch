import type { Http2Server, OutgoingHttpHeaders } from 'node:http2';

import { MALICIOUS_REDIRECT_PATHS } from '../attackServerConstants';
import type { AttackServerInitialiser } from './AttackServerInitialiser';

const paths = MALICIOUS_REDIRECT_PATHS;

/**
 * Initialises an HTTP/2 server to redirect to a malicious URL.
 */
export class RedirectAttackServerHttp2Initialiser implements AttackServerInitialiser<Http2Server> {
  public intialize(server: Http2Server): void {
    server.on('stream', (stream, headers): void => {
      const path = headers[':path']?.toString();

      if (path && path in paths) {
        const response: OutgoingHttpHeaders = paths[path as keyof typeof paths]();
        stream.respond(response);
        stream.end();
      }
    });
  }
}
