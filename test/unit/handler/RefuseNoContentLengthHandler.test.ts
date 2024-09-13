import type { ClientHttp2Stream, IncomingHttpHeaders } from 'node:http2';

import type { ResponseEventHandler } from '../../../src/handler/RequestEventHandler';

import {
  createRefuseNoContentLengthHandler,
} from '../../../src/handler/response/RefuseNoContentLengthHandler';

describe('createRefuseNoContentLengthHandler', (): void => {
  let handler: ResponseEventHandler;
  let request: jest.Mocked<ClientHttp2Stream>;
  let headers: jest.Mocked<IncomingHttpHeaders>;

  beforeEach((): void => {
    handler = createRefuseNoContentLengthHandler();
    request = {
      close: jest.fn(),
    } as any;
  });

  it(
    'should close the request if the content length is not provided.',
    (): void => {
      headers = {};
      handler(request, headers);
      expect(request.close).toHaveBeenCalledTimes(1);
    },
  );

  it(
    'should not close the request if the content length is provided.',
    (): void => {
      headers = {
        'content-length': '200',
      };

      handler(request, headers);
      expect(request.close).not.toHaveBeenCalled();
    },
  );
});
