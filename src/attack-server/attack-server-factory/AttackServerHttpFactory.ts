import type { Server } from 'node:http';
import { createServer } from 'node:http';

import type { AttackServerFactory } from './AttackServerFactory';

/**
 * An attack server factory specifically for HTTP/1.1 clients over TCP
 */
export class AttackServerHttpFactory implements AttackServerFactory<Server> {
  public createServer(options: object): Server {
    return createServer(options);
  }
}
