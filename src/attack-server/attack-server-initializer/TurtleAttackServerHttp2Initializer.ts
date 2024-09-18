import type { Http2SecureServer } from 'node:http2';
import { HTTP2_SERVER_PATHS, TURTLE_PATHS } from '../attackServerConstants';
import type { AttackServerInitializer } from './AttackServerInitializer';

const paths = { ...HTTP2_SERVER_PATHS, ...TURTLE_PATHS } as const;

/**
 * Initializes the attack server with the necessary event listener to attack on the `turtle`-path.
 */
export class TurtleAttackServerHttp2Initializer implements AttackServerInitializer<Http2SecureServer> {
  public initialize(server: Http2SecureServer): void {
    server.on('stream', (stream, headers): void => {
      const path = headers[':path'];

      if (path && path in paths) {
        const generator = paths[path as keyof typeof paths]();
        const { headers, body } = generator.generateResponse();

        stream.respond(headers);
        body.pipe(stream);
      }
    });
  }
}
