import type { Http2Server, OutgoingHttpHeaders } from 'node:http2';

import { MALICIOUS_REDIRECT_PATHS } from '../attackServerConstants';
import type { AttackServerInitializer } from './AttackServerInitializer';

const paths = MALICIOUS_REDIRECT_PATHS;

/**
 * Initializes an HTTP/2 server to redirect to a malicious URL.
 */
export class RedirectAttackServerHttp2Initializer implements AttackServerInitializer<Http2Server> {
  public initialize(server: Http2Server): void {
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
