import type { Http2Server, IncomingHttpHeaders, OutgoingHttpHeaders, ServerHttp2Stream } from 'node:http2';
import type { Readable } from 'node:stream';

import type { ResponseGenerator } from '../../response-generator/ResponseGenerator';
import { HTTP_SERVER_PATHS, PATHS } from '../attackServerConstants';
import type { AttackServerInitialiser } from './AttackServerInitialiser';

const paths = { ...HTTP_SERVER_PATHS, ...PATHS } as const;

export class AttackServerHttp2Initialiser implements AttackServerInitialiser<Http2Server> {
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
