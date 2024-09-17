import type { ClientHttp2Stream, IncomingHttpHeaders } from 'node:http2';

import type { ResponseEventHandler } from '../../../src/handler/RequestEventHandler';

import {
  createRefuseContentLongerThanHandler,
} from '../../../src/handler/examples/RefuseContentLengthLongerThanHandler';

describe('createRefuseContentLengthLongerThanHandler', (): void => {
  let handler: ResponseEventHandler;
  let request: jest.Mocked<ClientHttp2Stream>;
  let headers: jest.Mocked<IncomingHttpHeaders>;

  beforeEach((): void => {
    request = {
      close: jest.fn(),
    } as any;

    headers = {
      ':status': '200',
      'content-length': '200',
    } as any;
  });

  it(
    'should close the request if the content length is longer than the maximum allowed content length.',
    (): void => {
      handler = createRefuseContentLongerThanHandler(100);
      handler(request, headers);
      expect(request.close).toHaveBeenCalledTimes(1);
    },
  );

  it(
    'should not close the request if the content length is shorter than the maximum allowed content length.',
    (): void => {
      handler = createRefuseContentLongerThanHandler(300);
      handler(request, headers);
      expect(request.close).not.toHaveBeenCalled();
    },
  );

  it(
    'should not close the request if the content length is equal to the maximum allowed content length.',
    (): void => {
      handler = createRefuseContentLongerThanHandler(200);
      handler(request, headers);
      expect(request.close).not.toHaveBeenCalled();
    },
  );

  it('should close the request if the content length is not provided.', (): void => {
    handler = createRefuseContentLongerThanHandler(100);
    headers = {
      ':status': '200',
    };

    handler(request, headers);
    expect(request.close).toHaveBeenCalledTimes(1);
  });
});
