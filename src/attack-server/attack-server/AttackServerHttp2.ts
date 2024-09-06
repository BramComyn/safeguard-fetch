/* eslint-disable ts/naming-convention */
import type { OutgoingHttpHeaders, ServerHttp2Stream } from 'node:http2';
import type { Readable } from 'node:stream';

import { HTTP2_SERVER_PATHS, PATHS } from '../attackServerConstants';

import type {
  AttackServerHttp2SecureFactory,
} from '../attack-server-factory/AttackServerHttp2SecureFactory';

import type {
  AttackServerHttp2UnsecureFactory,
} from '../attack-server-factory/AttackServerHttp2UnsecureFactory';

import type { ResponseGenerator } from '../../response-generator/ResponseGenerator';
import { AttackServer } from './AttackServer';

const paths = { ...HTTP2_SERVER_PATHS, ...PATHS };

// An abstract class to describe the common functionality of HTTP/2.0 attack servers
export class AttackServerHttp2 extends AttackServer {
  public constructor(
    port: number,
    attackServerFactory: AttackServerHttp2UnsecureFactory | AttackServerHttp2SecureFactory,
  ) {
    super(port, attackServerFactory);
  }

  protected initiateServer(): void {
    this.server.on('stream', (stream: ServerHttp2Stream, headers: { ':path': string }): void => {
      // If headers or headers[':path'] is undefined, set path to '/'
      const path = headers ? headers[':path'].toString() ?? '/' : '/';

      // Check whether a valid path is requested
      if (path in paths) {
        const generator: ResponseGenerator = paths[path as keyof typeof paths]();
        const response: { headers: OutgoingHttpHeaders; body: Readable } = generator.generateResponse();
        stream.respond({
          ':status': 200,
          ...response.headers,
        });
        response.body.pipe(stream);
      }
    });
  }
}
