/* eslint-disable jest/prefer-spy-on */
import type { IncomingMessage, Server, ServerResponse } from 'node:http';
import { EventEmitter } from 'node:events';
import { PassThrough } from 'node:stream';

import {
  AttackServerHttpInitialiser,
} from '../../../../src/attack-server/attack-server-initialiser/AttackServerHttpInitialiser';

import { HTTP_SERVER_PATHS, PATHS } from '../../../../src/attack-server/attackServerConstants';
import { AttackServer } from '../../../../src/attack-server/attack-server/AttackServer';

import type {
  AttackServerHttpFactory,
} from '../../../../src/attack-server/attack-server-factory/AttackServerHttpFactory';

const paths = { ...HTTP_SERVER_PATHS, ...PATHS };
const port = 8080;

// Prevent `/infinite` from actually running
jest.useFakeTimers();
jest.spyOn(globalThis, 'setInterval');

describe('AttackServerHttp', (): any => {
  let initialiser: AttackServerHttpInitialiser;
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

    initialiser = new AttackServerHttpInitialiser();

    response = new PassThrough() as any;
    // No spyOn, as response doesn't have a writeHead property when initialised like this
    response.writeHead = jest.fn();

    request = {
      url: '/',
    } as any;
  });

  it('should not respond to unknown paths.', (): any => {
    // Set URL path to unknown path
    request.url = '/unknown-path';

    const attackServer = new AttackServer<Server>(port, factory, initialiser);
    attackServer.startServer();

    server.emit('request', request, response);

    expect(response.writeHead).not.toHaveBeenCalled();
  });

  it.each(Object.keys(paths))('should respond to %s path.', (path: string): any => {
    // Renew response
    response = new PassThrough() as any;
    // No spyOn, as response doesn't have a writeHead property when initialised like this
    response.writeHead = jest.fn();

    // Set URL path to known path
    request.url = path;

    const attackServer = new AttackServer<Server>(port, factory, initialiser);
    attackServer.startServer();

    server.emit('request', request, response);

    expect(response.writeHead).toHaveBeenCalledTimes(1);
  });
});
