/* eslint-disable jest/prefer-spy-on */
import type { Http2SecureServer, ServerHttp2Stream } from 'node:http2';
import { EventEmitter } from 'node:events';
import { PassThrough } from 'node:stream';

import {
  CONTENT_LENGTH_PATHS,
  HTTP2_SERVER_PATHS,
} from '../../../../src/attack-server/attackServerConstants';

import {
  ContentLengthAttackServerHttp2Initializer,
} from '../../../../src/attack-server/attack-server-initializer/ContentLengthAttackServerHttp2Initializer';

const paths = { ...HTTP2_SERVER_PATHS, ...CONTENT_LENGTH_PATHS };

// Prevent `/infinite` from actually running
jest.useFakeTimers();
jest.spyOn(globalThis, 'setInterval');

describe('ContentLengthAttackServerInitializer', (): any => {
  let initializer: ContentLengthAttackServerHttp2Initializer;
  let server: jest.Mocked<Http2SecureServer>;
  let stream: jest.Mocked<ServerHttp2Stream>;
  let headers: { ':path': string };

  beforeEach((): any => {
    server = new EventEmitter() as any;

    stream = new PassThrough() as any;
    stream.respond = jest.fn();
    headers = { ':path': '/' };

    initializer = new ContentLengthAttackServerHttp2Initializer();
    initializer.initialize(server);
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
    server.emit('stream', stream, headers);
    expect(stream.respond).toHaveBeenCalledTimes(1);
  });
});
