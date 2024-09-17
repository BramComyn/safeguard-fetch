/* eslint-disable jest/prefer-spy-on */
import { EventEmitter } from 'node:events';
import { PassThrough } from 'node:stream';
import type { Http2SecureServer, ServerHttp2Stream } from 'node:http2';

import {
  JsonLdAttackServerHttp2Initializer,
} from '../../../../src/attack-server/attack-server-initializer/JsonLdAttackServerHttp2Initializer';

import { HTTP2_SERVER_PATHS, JSONLD_PATHS } from '../../../../src/attack-server/attackServerConstants';

const paths = { ...HTTP2_SERVER_PATHS, ...JSONLD_PATHS } as const;

describe('JsonLdAttackServerHttp2Initializer', (): void => {
  let initializer: JsonLdAttackServerHttp2Initializer;
  let server: jest.Mocked<Http2SecureServer>;
  let stream: jest.Mocked<ServerHttp2Stream>;
  let headers: { ':path': string };

  beforeEach((): void => {
    server = new EventEmitter() as any;

    stream = new PassThrough() as any;
    stream.respond = jest.fn();
    headers = { ':path': '/' };

    initializer = new JsonLdAttackServerHttp2Initializer();
    initializer.intialize(server);
  });

  it('should make the server not respond to unknown paths.', (): void => {
    // Set path to unknown path
    headers[':path'] = '/unknown-path';
    server.emit('stream', stream, headers);
    expect(stream.respond).not.toHaveBeenCalled();
  });

  it.each(Object.keys(paths))('should make the server respond to %s path.', (path: string): void => {
    headers[':path'] = path;
    server.emit('stream', stream, headers);
    expect(stream.respond).toHaveBeenCalledTimes(1);
  });
});
