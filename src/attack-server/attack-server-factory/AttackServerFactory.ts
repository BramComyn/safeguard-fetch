import type { Server } from 'node:http';
import type { Http2SecureServer, Http2Server } from 'node:http2';

// Interface for server factories
export interface AttackServerFactory {
  createHttpServer: () => Server | Http2Server | Http2SecureServer;
}
