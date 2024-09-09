/* eslint-disable ts/naming-convention */
import type { Http2Server } from 'node:http2';

import { MALICIOUS_REDIRECT_PATHS } from '../attackServerConstants';
import type { AttackServerInitialiser } from './AttackServerInitialiser';

const paths = MALICIOUS_REDIRECT_PATHS;

/**
 * Initialises an HTTP/2 server to redirect to a malicious URL.
 */
export class RedirectAttackServerHttp2Initialiser implements AttackServerInitialiser<Http2Server> {
  public intialize(server: Http2Server): void {
    server.on('stream', (stream, headers): void => {
      const path = headers[':path'];

      if (path && path in paths) {
        const { status, location } = paths[path as keyof typeof paths]();
        stream.respond({ ':status': status, location });
      }
    });
  }
}
