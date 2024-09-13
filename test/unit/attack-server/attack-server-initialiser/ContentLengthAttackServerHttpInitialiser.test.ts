/* eslint-disable jest/prefer-spy-on */
import type { IncomingMessage, Server, ServerResponse } from 'node:http';
import { EventEmitter } from 'node:events';
import { PassThrough } from 'node:stream';

import {
  ContentLengthAttackServerHttpInitialiser,
} from '../../../../src/attack-server/attack-server-initialiser/ContentLengthAttackServerHttpInitialiser';

import { CONTENT_LENGTH_PATHS, HTTP_SERVER_PATHS } from '../../../../src/attack-server/attackServerConstants';
import { AttackServer } from '../../../../src/attack-server/attack-server/AttackServer';
import { getPort } from '../../../../src/util';

import type {
  AttackServerHttpFactory,
} from '../../../../src/attack-server/attack-server-factory/AttackServerHttpFactory';

const paths = { ...HTTP_SERVER_PATHS, ...CONTENT_LENGTH_PATHS };

const TEST_NAME = 'ContentLengthAttackServerHttpInitialiserUnit';
const port = getPort(TEST_NAME);

// Prevent `/infinite` from actually running
jest.useFakeTimers();
jest.spyOn(globalThis, 'setInterval');

describe('ContentLengthAttackServerHttpInitialiser', (): any => {
  let initialiser: ContentLengthAttackServerHttpInitialiser;
  let factory: jest.Mocked<AttackServerHttpFactory>;
  let server: jest.Mocked<Server>;
  let request: jest.Mocked<IncomingMessage>;
  let response: jest.Mocked<ServerResponse>;

  beforeEach((): any => {
    server = new EventEmitter() as any;
    // No spyOn, as server doesn't have a listen property when initialised like this
    server.listen = jest.fn();

    factory = {
      createServer: jest.fn().mockReturnValue(server),
    };

    initialiser = new ContentLengthAttackServerHttpInitialiser();

    response = new PassThrough() as any;
    // No spyOn, as response doesn't have a writeHead property when initialised like this
    response.writeHead = jest.fn();

    request = {
      url: '/',
    } as any;
  });

  it('should make the server not respond to unknown paths.', (): any => {
    // Set URL path to unknown path
    request.url = '/unknown-path';

    const attackServer = new AttackServer<Server>(port, factory, [ initialiser ]);
    attackServer.start();

    server.emit('request', request, response);

    expect(response.writeHead).not.toHaveBeenCalled();
  });

  it.each(Object.keys(paths))('should make the server respond to %s path.', (path: string): any => {
    // Renew response
    response = new PassThrough() as any;
    // No spyOn, as response doesn't have a writeHead property when initialised like this
    response.writeHead = jest.fn();

    // Set URL path to known path
    request.url = path;

    const attackServer = new AttackServer<Server>(port, factory, [ initialiser ]);
    attackServer.start();

    server.emit('request', request, response);

    expect(response.writeHead).toHaveBeenCalledTimes(1);
  });
});
