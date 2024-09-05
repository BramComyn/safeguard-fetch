import type { Http2SecureServer } from 'node:http2';
import { createSecureServer } from 'node:http2';
import { readFileSync } from 'node:fs';

import { fromRoot } from '../../util';

import type { AttackServerFactory } from './AttackServerFactory';

const options = {
  key: readFileSync(fromRoot('assets/localhost-privkey.pem')),
  cert: readFileSync(fromRoot('assets/localhost-cert.pem')),
};

// An attack server factory specifically for HTTP/2.0 clients over TLS
export class AttackServerHttp2SecureFactory implements AttackServerFactory {
  public createHttpServer(): Http2SecureServer {
    return createSecureServer(options);
  }
}
