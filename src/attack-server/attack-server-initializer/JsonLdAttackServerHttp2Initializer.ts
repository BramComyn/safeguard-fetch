import type { Http2SecureServer } from 'node:http2';

import { HTTP2_SERVER_PATHS, JSONLD_PATHS } from '../attackServerConstants';
import type { ResponseGenerator } from '../../response-generator/ResponseGenerator';
import type { AttackServerInitializer } from './AttackServerInitializer';

const paths = { ...HTTP2_SERVER_PATHS, ...JSONLD_PATHS } as const;

/**
 * Initializes the attack server to respond with the necessary JSON-LD data.
 */
export class JsonLdAttackServerHttp2Initializer implements AttackServerInitializer<Http2SecureServer> {
  public initialize(server: Http2SecureServer): void {
    server.on('stream', (stream, headers): void => {
      const path = headers[':path'];

      if (path && path in paths) {
        const generator: ResponseGenerator = paths[path as keyof typeof paths]();
        const { headers, body } = generator.generateResponse();

        stream.respond(headers);
        body.pipe(stream);
      }
    });
  }
}
