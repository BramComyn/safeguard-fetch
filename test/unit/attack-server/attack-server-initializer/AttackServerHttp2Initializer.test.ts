/* eslint-disable jest/prefer-spy-on */
import type { Http2Server, ServerHttp2Stream } from 'node:http2';
import { EventEmitter } from 'node:events';
import { PassThrough } from 'node:stream';

import type { ResponseGenerator } from '../../../../src/response-generator/ResponseGenerator';

import {
  AttackServerHttp2Initialiser,
} from '../../../../src/attack-server/attack-server-initialiser/AttackServerHttp2Initialiser';

describe('AttackServerHttp2Initialiser', (): void => {
  let initialiser: AttackServerHttp2Initialiser;
  let responseGenerator: jest.Mocked<ResponseGenerator>;
  let server: jest.Mocked<Http2Server>;
  let stream: jest.Mocked<ServerHttp2Stream>;
  let headers: { ':path': string };
  let body: jest.Mocked<PassThrough>;

  beforeEach((): void => {
    server = new EventEmitter() as any;

    stream = new EventEmitter() as any;
    stream.respond = jest.fn();

    responseGenerator = {
      generateResponse: jest.fn().mockReturnValue({ headers: {}, body: null }),
    };

    body = new PassThrough() as any;
    jest.spyOn(body, 'pipe').mockImplementation();

    initialiser = new AttackServerHttp2Initialiser({ '/': responseGenerator });
    initialiser.initialise(server);
  });

  it('should create an instance.', (): void => {
    const initialiser = new AttackServerHttp2Initialiser();
    expect(initialiser).toBeDefined();
  });

  it('should make the server respond to known paths.', (): void => {
    headers = { ':path': '/' };
    server.emit('stream', stream, headers);

    expect(responseGenerator.generateResponse).toHaveBeenCalledTimes(1);
    expect(stream.respond).toHaveBeenCalledTimes(1);
  });

  it('should not make the server respond to unknown paths.', (): void => {
    headers = { ':path': '/unknown' };
    server.emit('stream', stream, headers);

    expect(responseGenerator.generateResponse).not.toHaveBeenCalled();
    expect(stream.respond).not.toHaveBeenCalled();
  });

  it('should not call body.pipe if body is falsy.', (): void => {
    responseGenerator.generateResponse.mockReturnValue({ headers: {}, body: undefined });
    headers = { ':path': '/' };
    server.emit('stream', stream, headers);

    expect(body.pipe).not.toHaveBeenCalled();
  });

  it('should call body.pipe if body is truthy.', (): void => {
    responseGenerator.generateResponse.mockReturnValue({ headers: {}, body });
    headers = { ':path': '/' };
    server.emit('stream', stream, headers);

    expect(body.pipe).toHaveBeenCalledTimes(1);
  });
});
