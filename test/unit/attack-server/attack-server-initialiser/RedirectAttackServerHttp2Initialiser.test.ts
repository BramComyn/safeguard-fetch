/* eslint-disable jest/prefer-spy-on */
import type { Http2SecureServer, ServerHttp2Stream } from 'node:http2';
import { EventEmitter } from 'node:events';
import { PassThrough } from 'node:stream';

import {
  RedirectAttackServerHttp2Initialiser,
} from '../../../../src/attack-server/attack-server-initialiser/RedirectAttackServerHttp2Initialiser';

import { MALICIOUS_REDIRECT_PATHS } from '../../../../src/attack-server/attackServerConstants';

const paths = MALICIOUS_REDIRECT_PATHS;

describe('RedirectAttackServerHttp2Initialiser', (): any => {
  let initialiser: RedirectAttackServerHttp2Initialiser;
  let server: jest.Mocked<Http2SecureServer>;
  let stream: jest.Mocked<ServerHttp2Stream>;
  let headers: { ':path': string };

  beforeEach((): any => {
    server = new EventEmitter() as any;

    stream = new PassThrough() as any;
    stream.respond = jest.fn();
    headers = { ':path': '/' };

    initialiser = new RedirectAttackServerHttp2Initialiser();
    initialiser.intialize(server);
  });

  it('should make the server not respond to unknown paths.', (): any => {
    // Set path to unknown path
    headers[':path'] = '/unknown-path';
    server.emit('stream', stream, headers);
    expect(stream.respond).not.toHaveBeenCalled();
  });

  it.each(Object.keys(paths))('should make the server respond to %s path.', (path: string): any => {
    // Set path to known path
    headers[':path'] = path;
    const argument = paths[path as keyof typeof paths]();

    server.emit('stream', stream, headers);
    expect(stream.respond).toHaveBeenCalledWith(argument);
  });
});
