/* eslint-disable jest/prefer-spy-on */
import type { Http2SecureServer, ServerHttp2Stream } from 'node:http2';
import { EventEmitter } from 'node:events';
import { PassThrough } from 'node:stream';

import {
  RedirectAttackServerHttp2Initialiser,
} from '../../../../src/attack-server/attack-server-initialiser/RedirectAttackServerHttp2Initialiser';

import { AttackServer } from '../../../../src/attack-server/attack-server/AttackServer';
import { MALICIOUS_REDIRECT_PATHS } from '../../../../src/attack-server/attackServerConstants';

import type {
  AttackServerHttp2SecureFactory,
} from '../../../../src/attack-server/attack-server-factory/AttackServerHttp2SecureFactory';
import { getPort } from '../../../../src/util';

const paths = MALICIOUS_REDIRECT_PATHS;

const TEST_NAME = 'RedirectAttackServerHttp2InitialiserUnit';
const port = getPort(TEST_NAME);

describe('RedirectAttackServerHttp2Initialiser', (): any => {
  let initialiser: RedirectAttackServerHttp2Initialiser;
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

    initialiser = new RedirectAttackServerHttp2Initialiser();

    stream = new PassThrough() as any;
    stream.respond = jest.fn();
    headers = { ':path': '/' };
  });

  it('should make the server not respond to unknown paths.', (): any => {
    // Set path to unknown path
    headers[':path'] = '/unknown-path';

    const attackServer = new AttackServer<Http2SecureServer>(port, factory, initialiser);
    attackServer.start();

    server.emit('stream', stream, headers);
    expect(stream.respond).not.toHaveBeenCalled();
  });

  it.each(Object.keys(paths))('should make the server respond to %s path.', (path: string): any => {
    // Set path to known path
    headers[':path'] = path;

    const argument = paths[path as keyof typeof paths]();

    const attackServer = new AttackServer<Http2SecureServer>(port, factory, initialiser);
    attackServer.start();

    server.emit('stream', stream, headers);
    expect(stream.respond).toHaveBeenCalledWith(argument);
  });
});
