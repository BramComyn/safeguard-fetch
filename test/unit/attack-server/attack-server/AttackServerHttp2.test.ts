/* eslint-disable jest/prefer-called-with */
/* eslint-disable jest/prefer-spy-on */
import type { Http2SecureServer, ServerHttp2Stream } from 'node:http2';
import { EventEmitter } from 'node:events';
import { PassThrough } from 'node:stream';

import {
  AttackServerHttp2Initialiser,
} from '../../../../src/attack-server/attack-server-initialiser/AttackServerHttp2Initialiser';

import { AttackServer } from '../../../../src/attack-server/attack-server/AttackServer';
import { HTTP2_SERVER_PATHS, PATHS } from '../../../../src/attack-server/attackServerConstants';

import type {
  AttackServerHttp2SecureFactory,
} from '../../../../src/attack-server/attack-server-factory/AttackServerHttp2SecureFactory';

const paths = { ...HTTP2_SERVER_PATHS, ...PATHS };
const port = 8443;

// Prevent `/infinite` from actually running
jest.useFakeTimers();
jest.spyOn(globalThis, 'setInterval');

describe('AttackServerHttp2', (): any => {
  let initialiser: AttackServerHttp2Initialiser;
  let factory: jest.Mocked<AttackServerHttp2SecureFactory>;
  let server: jest.Mocked<Http2SecureServer>;
  let stream: jest.Mocked<ServerHttp2Stream>;
  let headers: { ':path': string };

  beforeEach((): any => {
    server = new EventEmitter() as any;
    server.listen = jest.fn();

    factory = {
      createServer: jest.fn().mockReturnValue(server),
    };

    initialiser = new AttackServerHttp2Initialiser();

    stream = new PassThrough() as any;
    stream.respond = jest.fn();
    headers = { ':path': '/' };
  });

  it('should not respond to unknown paths.', (): any => {
    // Set path to unknown path
    headers[':path'] = '/unknown-path';

    const attackServer = new AttackServer<Http2SecureServer>(port, factory, initialiser);
    attackServer.startServer();

    server.emit('stream', stream, headers);
    expect(stream.respond).not.toHaveBeenCalled();
  });

  it.each(Object.keys(paths))('should respond to %s path.', (path: string): any => {
    // Set path to known path
    headers[':path'] = path;

    const attackServer = new AttackServer<Http2SecureServer>(port, factory, initialiser);
    attackServer.startServer();

    server.emit('stream', stream, headers);

    expect(stream.respond).toHaveBeenCalled();
  });
});
