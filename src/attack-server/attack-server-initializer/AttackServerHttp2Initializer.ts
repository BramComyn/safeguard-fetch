import type { Http2Server, IncomingHttpHeaders, ServerHttp2Stream } from 'node:http2';

import type { AttackServerInitializer, ResponseGeneratorMap } from './AttackServerInitializer';

/**
 * Class for initializing HTTP/2.0 attack servers.
 *
 * @member responseGenerators - A map of response generators for each path.
 * @method initialize - initializes the server with the necessary event listeners.
 */
export class AttackServerHttp2Initializer implements AttackServerInitializer<Http2Server> {
  public constructor(
    protected responseGenerators: ResponseGeneratorMap = {},
  ) {}

  public initialize(server: Http2Server): void {
    server.on('stream', (stream: ServerHttp2Stream, inboundHeaders: IncomingHttpHeaders): void => {
      const path = inboundHeaders[':path'];

      if (path && path in this.responseGenerators) {
        const generator = this.responseGenerators[path];
        const { headers, body } = generator.generateResponse();

        stream.respond(headers);

        if (body) {
          body.pipe(stream);
        }
      }
    });
  }
}
