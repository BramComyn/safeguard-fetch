import type { ClientHttp2Stream, IncomingHttpHeaders } from 'node:http2';

import {
  RefuseContentLengthLongerThanHandler,
} from '../../../src/handler/response/RefuseContentLengthLongerThanHandler';

describe('RefuseContentLengthLongerThanHandler', (): void => {
  let handler: RefuseContentLengthLongerThanHandler;
  let request: jest.Mocked<ClientHttp2Stream>;
  let headers: jest.Mocked<IncomingHttpHeaders>;

  beforeEach((): void => {
    request = {
      close: jest.fn(),
    } as any;

    headers = {
      'content-length': '200',
    } as any;
  });

  it(
    'should close the request if the content length is longer than the maximum allowed content length.',
    (): void => {
      handler = new RefuseContentLengthLongerThanHandler(100);
      handler.handle(request, headers);
      expect(request.close).toHaveBeenCalledTimes(1);
    },
  );

  it(
    'should not close the request if the content length is shorter than the maximum allowed content length.',
    (): void => {
      handler = new RefuseContentLengthLongerThanHandler(300);
      handler.handle(request, headers);
      expect(request.close).not.toHaveBeenCalled();
    },
  );

  it(
    'should not close the request if the content length is equal to the maximum allowed content length.',
    (): void => {
      handler = new RefuseContentLengthLongerThanHandler(200);
      handler.handle(request, headers);
      expect(request.close).not.toHaveBeenCalled();
    },
  );

  it('should close the request if the content length is not provided.', (): void => {
    handler = new RefuseContentLengthLongerThanHandler(100);
    headers = {};

    handler.handle(request, headers);
    expect(request.close).toHaveBeenCalledTimes(1);
  });
});
