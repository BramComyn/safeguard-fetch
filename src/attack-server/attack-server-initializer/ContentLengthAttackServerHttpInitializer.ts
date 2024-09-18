import type { IncomingMessage, OutgoingHttpHeaders, Server, ServerResponse } from 'node:http';
import type { Readable } from 'node:stream';

import type { ResponseGenerator } from '../../response-generator/ResponseGenerator';
import { CONTENT_LENGTH_PATHS, HTTP_SERVER_PATHS } from '../attackServerConstants';
import type { AttackServerInitializer } from './AttackServerInitializer';

const paths = { ...HTTP_SERVER_PATHS, ...CONTENT_LENGTH_PATHS } as const;

/**
 * Initializes the attack server with the necessary event listeners for the `content-length` attack over HTTP/1.1
 */
export class ContentLengthAttackServerHttpInitializer implements AttackServerInitializer<Server> {
  public initialize(server: Server): void {
    server.on('request', (req: IncomingMessage, res: ServerResponse): void => {
      const path = req.url?.toString();

      // Check whether a valid path is requested
      if (path && path in paths) {
        const generator: ResponseGenerator = paths[path as keyof typeof paths]();
        const response: { headers: OutgoingHttpHeaders; body: Readable } =
          generator.generateResponse();
        res.writeHead(200, response.headers);
        response.body.pipe(res);
      }
    });
  }
}
