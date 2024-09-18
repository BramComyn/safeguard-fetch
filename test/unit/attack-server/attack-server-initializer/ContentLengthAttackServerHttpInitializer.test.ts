/* eslint-disable jest/prefer-spy-on */
import type { IncomingMessage, Server, ServerResponse } from 'node:http';
import { EventEmitter } from 'node:events';
import { PassThrough } from 'node:stream';

import {
  ContentLengthAttackServerHttpInitializer,
} from '../../../../src/attack-server/attack-server-initializer/ContentLengthAttackServerHttpInitializer';

import { CONTENT_LENGTH_PATHS, HTTP_SERVER_PATHS } from '../../../../src/attack-server/attackServerConstants';

const paths = { ...HTTP_SERVER_PATHS, ...CONTENT_LENGTH_PATHS };

// Prevent `/infinite` from actually running
jest.useFakeTimers();
jest.spyOn(globalThis, 'setInterval');

describe('ContentLengthAttackServerHttpInitializer', (): any => {
  let initializer: ContentLengthAttackServerHttpInitializer;
  let server: jest.Mocked<Server>;
  let request: jest.Mocked<IncomingMessage>;
  let response: jest.Mocked<ServerResponse>;

  beforeEach((): any => {
    server = new EventEmitter() as any;
    server.listen = jest.fn();

    response = new PassThrough() as any;
    response.writeHead = jest.fn();

    request = {
      url: '/',
    } as any;

    initializer = new ContentLengthAttackServerHttpInitializer();
    initializer.initialize(server);
  });

  it('should make the server not respond to unknown paths.', (): any => {
    // Set URL path to unknown path
    request.url = '/unknown-path';
    server.emit('request', request, response);
    expect(response.writeHead).not.toHaveBeenCalled();
  });

  it.each(Object.keys(paths))('should make the server respond to %s path.', (path: string): any => {
    request = {
      url: path,
    } as any;

    server.emit('request', request, response);
    expect(response.writeHead).toHaveBeenCalledTimes(1);
  });
});
