import type { Http2Server, IncomingHttpHeaders, OutgoingHttpHeaders, ServerHttp2Stream } from 'node:http2';
import type { Readable } from 'node:stream';

import type { ResponseGenerator } from '../../response-generator/ResponseGenerator';
import { CONTENT_LENGTH_PATHS, HTTP2_SERVER_PATHS } from '../attackServerConstants';
import type { AttackServerInitialiser } from './AttackServerInitialiser';

const paths = { ...HTTP2_SERVER_PATHS, ...CONTENT_LENGTH_PATHS } as const;

/**
 * Initialises the attack server with the necessary event listeners for the `content-length` attack over HTTP/2.0
 */
export class ContentLengthAttackServerHttp2Initialiser implements AttackServerInitialiser<Http2Server> {
  public intialize(server: Http2Server): void {
    server.on('stream', (stream: ServerHttp2Stream, headers: IncomingHttpHeaders): void => {
      // If headers or headers[':path'] is undefined, set path to '/'
      const path = headers[':path']?.toString() ?? '/';

      // Check whether a valid path is requested
      if (path in paths) {
        const generator: ResponseGenerator = paths[path as keyof typeof paths]();
        const response: { headers: OutgoingHttpHeaders; body: Readable } =
          generator.generateResponse();
        stream.respond(response.headers);
        response.body.pipe(stream);
      }
    });
  }
}
