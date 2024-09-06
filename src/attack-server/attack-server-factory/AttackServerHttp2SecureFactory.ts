import type { Http2SecureServer } from 'node:http2';
import { createSecureServer } from 'node:http2';

import type { AttackServerFactory } from './AttackServerFactory';

/**
 * An attack server factory specifically for HTTP/2.0 clients over TLS
 */
export class AttackServerHttp2SecureFactory implements AttackServerFactory<Http2SecureServer> {
  public createServer(options: object): Http2SecureServer {
    return createSecureServer(options);
  }
}
