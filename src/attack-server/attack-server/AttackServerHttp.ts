import type { IncomingMessage, OutgoingHttpHeaders, ServerResponse } from 'node:http';
import type { Readable } from 'node:stream';

import { HTTP_SERVER_PATHS, PATHS } from '../attackServerConstants';
import type { AttackServerHttpFactory } from '../attack-server-factory/AttackServerHttpFactory';
import type { ResponseGenerator } from '../../reponse-generator/ResponseGenerator';
import { AttackServer } from './AttackServer';

const paths = { ...HTTP_SERVER_PATHS, ...PATHS };

// An attack server specifically for HTTP/1.1 clients
export class AttackServerHttp extends AttackServer {
  public constructor(port: number, attackServerFactory: AttackServerHttpFactory) {
    super(port, attackServerFactory);
  }

  protected initiateServer(): void {
    this.server.on('request', (req: IncomingMessage, res: ServerResponse): void => {
      const path = req.url?.toString() ?? '/';

      // Check whether a valid path is requested
      if (path in paths) {
        const generator: ResponseGenerator = paths[path as keyof typeof paths];
        const response: { headers: OutgoingHttpHeaders; body: Readable } =
          generator.generateResponse();
        res.writeHead(200, response.headers);
        res.write(response.body);
        res.end();
      }
    });
  }
}
