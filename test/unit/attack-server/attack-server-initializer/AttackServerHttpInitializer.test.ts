/* eslint-disable jest/prefer-spy-on */
import type { Server, ServerResponse } from 'node:http';
import { EventEmitter } from 'node:events';
import { PassThrough } from 'node:stream';

import type { ResponseGenerator } from '../../../../src/response-generator/ResponseGenerator';

import {
  AttackServerHttpInitialiser,
} from '../../../../src/attack-server/attack-server-initialiser/AttackServerHttpInitialiser';

describe('AttackServerHttpInitialiser', (): void => {
  let initialiser: AttackServerHttpInitialiser;
  let responseGenerator: jest.Mocked<ResponseGenerator>;
  let server: jest.Mocked<Server>;
  let response: jest.Mocked<ServerResponse>;
  let request: { url: string };
  let body: jest.Mocked<PassThrough>;

  beforeEach((): void => {
    server = new EventEmitter() as any;

    response = new EventEmitter() as any;
    response.writeHead = jest.fn();

    responseGenerator = {
      generateResponse: jest.fn().mockReturnValue({ headers: { ':status': 200 }, body: undefined }),
    };

    body = new PassThrough() as any;
    jest.spyOn(body, 'pipe').mockImplementation();

    initialiser = new AttackServerHttpInitialiser({ '/': responseGenerator });
    initialiser.initialise(server);
  });

  it('should create an instance.', (): void => {
    const initialiser = new AttackServerHttpInitialiser();
    expect(initialiser).toBeDefined();
  });

  it('should make the server respond to known paths.', (): void => {
    request = { url: '/' };
    server.emit('request', request, response);

    expect(responseGenerator.generateResponse).toHaveBeenCalledTimes(1);
    expect(response.writeHead).toHaveBeenCalledTimes(1);
  });

  it('should not make the server respond to unknown paths.', (): void => {
    request = { url: '/unknown' };
    server.emit('request', request, response);

    expect(responseGenerator.generateResponse).not.toHaveBeenCalled();
    expect(response.writeHead).not.toHaveBeenCalled();
  });

  it('should not call body.pipe if body is falsy.', (): void => {
    responseGenerator.generateResponse.mockReturnValue({ headers: { ':status': 200 }, body: undefined });
    request = { url: '/' };
    server.emit('request', request, response);

    expect(body.pipe).not.toHaveBeenCalled();
  });

  it('should call body.pipe if body is truthy.', (): void => {
    responseGenerator.generateResponse.mockReturnValue({ headers: { ':status': 200 }, body });
    request = { url: '/' };
    server.emit('request', request, response);

    expect(body.pipe).toHaveBeenCalledTimes(1);
  });
});
