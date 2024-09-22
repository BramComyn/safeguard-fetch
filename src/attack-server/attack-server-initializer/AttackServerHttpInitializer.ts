import type { Server } from 'node:http';

import { getStatusCode } from '../../util';
import type { AttackServerInitializer, ResponseGeneratorMap } from './AttackServerInitializer';

/**
 * Class for initializing HTTP/1.1 attack servers.
 *
 * @member responseGenerators - A map of response generators for each path.
 * @method initialize - initializes the server with the necessary event listeners.
 */
export class AttackServerHttpInitializer implements AttackServerInitializer<Server> {
  public constructor(
    protected responseGenerators: ResponseGeneratorMap = {},
  ) {}

  public initialize(server: Server): void {
    server.on('request', (req, res): void => {
      const path = req.url?.toString();

      if (path && path in this.responseGenerators) {
        const generator = this.responseGenerators[path];
        const { headers, body } = generator.generateResponse();
        const statusCode = getStatusCode(headers);

        res.writeHead(statusCode, headers);

        if (body) {
          body.pipe(res);
        }
      }
    });
  }
}
