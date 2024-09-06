/* eslint-disable jest/prefer-called-with */
/* eslint-disable jest/prefer-spy-on */
import type { Http2SecureServer, ServerHttp2Stream } from 'node:http2';
import { EventEmitter } from 'node:events';
import { PassThrough } from 'node:stream';

import { AttackServerHttp2 } from '../../../../src/attack-server/attack-server/AttackServerHttp2';

import type {
  AttackServerHttp2SecureFactory,
} from '../../../../src/attack-server/attack-server-factory/AttackServerHttp2SecureFactory';

import { HTTP2_SERVER_PATHS, PATHS } from '../../../../src/attack-server/attackServerConstants';

const paths = { ...HTTP2_SERVER_PATHS, ...PATHS };
const port = 8443;

// Prevent `/infinite` from actually running
jest.useFakeTimers();
jest.spyOn(globalThis, 'setInterval');

describe('AttackServerHttp2', (): any => {
  let factory: jest.Mocked<AttackServerHttp2SecureFactory>;
  let server: jest.Mocked<Http2SecureServer>;
  let stream: jest.Mocked<ServerHttp2Stream>;
  let headers: { ':path': string };

  beforeEach((): any => {
    server = new EventEmitter() as any;
    server.listen = jest.fn();

    factory = {
      createServer: jest.fn().mockReturnValue(server),
    } as any;

    stream = new PassThrough() as any;
    stream.respond = jest.fn();
    headers = { ':path': '/' };
  });

  it('should not respond to unknown paths.', (): any => {
    // Set path to unknown path
    headers[':path'] = '/unknown-path';

    const attackServer = new AttackServerHttp2(port, factory);
    attackServer.startServer();

    server.emit('stream', stream, headers);
    expect(stream.respond).not.toHaveBeenCalled();
  });

  it.each(Object.keys(paths))('should respond to %s path.', (path: string): any => {
    // Set path to known path
    headers[':path'] = path;

    const attackServer = new AttackServerHttp2(port, factory);
    attackServer.startServer();

    server.emit('stream', stream, headers);

    expect(stream.respond).toHaveBeenCalled();
  });
});
