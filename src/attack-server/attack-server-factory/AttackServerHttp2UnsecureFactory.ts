import type { Http2Server } from 'node:http2';
import { createServer } from 'node:http2';

import type { AttackServerFactory } from './AttackServerFactory';

// An attack server factory specifically for HTTP/2.0 clients over TCP
export class AttackServerHttp2UnsecureFactory implements AttackServerFactory {
  public createHttpServer(): Http2Server {
    return createServer();
  }
}
