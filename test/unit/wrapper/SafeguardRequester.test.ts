/* eslint-disable jest/prefer-spy-on */
import type { ClientHttp2Session, ClientHttp2Stream } from 'node:http2';
import { EventEmitter } from 'node:events';

import * as http2 from 'node:http2';

import type { ClientEventHandler } from '../../../src/handler/ClientEventHandler';
import type { RequestEventHandler } from '../../../src/handler/RequestEventHandler';
import { SafeguardRequester } from '../../../src/wrapper/SafeguardRequester';

jest.mock('node:http2', (): object => ({
  connect: jest.fn(),
}));

describe('SafeguardRequester', (): void => {
  const authority = 'https://example.com';
  const sessionOptions = {};

  let requester: SafeguardRequester;

  let dummyConnectEventHandler: jest.Mocked<ClientEventHandler<'connect'>>;
  let dummyResponseEventHandler: jest.Mocked<RequestEventHandler<'response'>>;
  let clientSession: jest.Mocked<ClientHttp2Session>;
  let requestStream: jest.Mocked<ClientHttp2Stream>;

  let connect: jest.Mock;

  beforeEach((): void => {
    jest.clearAllMocks();

    dummyResponseEventHandler = {
      handle: jest.fn(),
    } as any;

    dummyConnectEventHandler = {
      handle: jest.fn(),
    } as any;

    requester = new SafeguardRequester(
      { connect: [ dummyConnectEventHandler ]},
      { response: [ dummyResponseEventHandler ]},
    );

    clientSession = new EventEmitter() as any;
    requestStream = new EventEmitter() as any;

    clientSession.request = jest.fn().mockReturnValue(requestStream);
    jest.spyOn(clientSession, 'request');
    connect = jest.mocked(http2.connect).mockReturnValue(clientSession);
  });

  it('also works with empty constructor.', (): void => {
    requester = new SafeguardRequester();
    expect(requester).toBeDefined();
  });

  it('should set the necessary event handlers on the client session.', (): void => {
    const client = requester.connect(authority, sessionOptions);
    expect(client).toBeDefined();

    client.emit('connect');
    client.emit('appelflap');

    expect(dummyConnectEventHandler.handle).toHaveBeenCalledTimes(1);
  });

  it('should set the necessary event handlers on the request stream.', (): void => {
    const request = requester.request(clientSession);
    expect(request).toBeDefined();

    request.emit('response');
    request.emit('appelflap');

    expect(dummyResponseEventHandler.handle).toHaveBeenCalledTimes(1);
  });

  it('should connect to the authority and return a new `ClientHttp2Session`.', (): void => {
    const client = requester.connect(authority, sessionOptions);

    expect(connect).toHaveBeenCalledWith(authority, sessionOptions, undefined);
    expect(connect).toHaveBeenCalledTimes(1);

    expect(client).toBeDefined();
  });

  it('should initiate a new request stream on an existing session and return a new `ClientHttp2Stream`.', (): void => {
    const request = requester.request(clientSession);
    expect(request).toBeDefined();
    expect(request).toEqual(requestStream);
  });

  it(
    'should connect to the authority, initiate a new request on the given path and return a new `ClientHttp2Stream`.',
    (): void => {
      const configuration = {
        authority,
        sessionOptions,
      };

      const request = requester.connectAndRequest(configuration);
      expect(request).toBeDefined();
    },
  );
});
