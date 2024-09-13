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

    dummyResponseEventHandler = jest.fn();
    dummyConnectEventHandler = jest.fn();

    requester = new SafeguardRequester();

    clientSession = new EventEmitter() as any;
    requestStream = new EventEmitter() as any;

    clientSession.request = jest.fn().mockReturnValue(requestStream);
    jest.spyOn(clientSession, 'request');
    connect = jest.mocked(http2.connect).mockReturnValue(clientSession);
  });

  it('also works with non-empty constructor.', (): void => {
    requester = new SafeguardRequester(
      { connect: [ dummyConnectEventHandler ]},
      { response: [ dummyResponseEventHandler ]},
    );

    expect(requester).toBeDefined();
  });

  it('should set the necessary event handlers on the client session.', (): void => {
    requester = new SafeguardRequester(
      { connect: [ dummyConnectEventHandler ]},
      {},
    );

    const client = requester.connect(authority, sessionOptions);
    expect(client).toBeDefined();

    client.emit('connect');
    client.emit('appelflap');

    expect(dummyConnectEventHandler).toHaveBeenCalledTimes(1);
  });

  it('should set the necessary event handlers on the request stream.', (): void => {
    requester = new SafeguardRequester(
      {},
      { response: [ dummyResponseEventHandler ]},
    );

    const request = requester.request(clientSession);
    expect(request).toBeDefined();

    request.emit('response');
    request.emit('appelflap');

    expect(dummyResponseEventHandler).toHaveBeenCalledTimes(1);
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

  it('should add new wrappers to the client session\'s event handlers.', (): void => {
    let client = requester.connect(authority, sessionOptions);
    client.emit('connect');
    expect(dummyConnectEventHandler).not.toHaveBeenCalled();

    requester.addClientEventHandler('connect', dummyConnectEventHandler);

    // We need to create a new client session, because the event handlers are set on creation.
    client = requester.connect(authority, sessionOptions);
    client.emit('connect');
    expect(dummyConnectEventHandler).toHaveBeenCalledTimes(1);
  });

  it('should add new wrappers to the request stream\'s event handlers.', (): void => {
    let request = requester.request(clientSession);
    request.emit('response');
    expect(dummyResponseEventHandler).not.toHaveBeenCalled();

    requester.addRequestEventHandler('response', dummyResponseEventHandler);

    // We need to create a new request stream, because the event handlers are set on creation.
    request = requester.request(clientSession);
    request.emit('response');
    expect(dummyResponseEventHandler).toHaveBeenCalledTimes(1);
  });

  it('should remove wrappers from the client session\'s event handlers.', (): void => {
    requester.addClientEventHandler('connect', dummyConnectEventHandler);
    requester.clearClientEventHandlers();

    const client = requester.connect(authority, sessionOptions);
    client.emit('connect');
    expect(dummyConnectEventHandler).not.toHaveBeenCalled();
  });

  it('should remove wrappers from the request stream\'s event handlers.', (): void => {
    requester.addRequestEventHandler('response', dummyResponseEventHandler);
    requester.clearRequestEventHandlers();

    const request = requester.request(clientSession);
    request.emit('response');
    expect(dummyResponseEventHandler).not.toHaveBeenCalled();
  });
});
