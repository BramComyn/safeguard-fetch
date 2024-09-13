import type { ClientHttp2Stream, IncomingHttpHeaders } from 'node:http2';

import {
  RefuseNoContentLengthHandler,
} from '../../../src/handler/response/RefuseNoContentLengthHandler';

describe('RefuseNoContentLengthHandler', (): void => {
  let handler: RefuseNoContentLengthHandler;
  let request: jest.Mocked<ClientHttp2Stream>;
  let headers: jest.Mocked<IncomingHttpHeaders>;

  beforeEach((): void => {
    handler = new RefuseNoContentLengthHandler();
    request = {
      close: jest.fn(),
    } as any;
  });

  it(
    'should close the request if the content length is not provided.',
    (): void => {
      headers = {};
      handler.handle(request, headers);
      expect(request.close).toHaveBeenCalledTimes(1);
    },
  );

  it(
    'should not close the request if the content length is provided.',
    (): void => {
      headers = {
        'content-length': '200',
      };

      handler.handle(request, headers);
      expect(request.close).not.toHaveBeenCalled();
    },
  );
});
