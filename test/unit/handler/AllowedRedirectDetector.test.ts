import type { ClientHttp2Stream, IncomingHttpHeaders } from 'node:http2';
import { createAllowedRedirectDetector } from '../../../src/handler/examples/AllowedRedirectDetector';

import {
  MALICIOUS_REDIRECT_PATHS,
  NON_MALICIOUS_REDIRECT_URL,
} from '../../../src/attack-server/attackServerConstants';

import type { ResponseEventHandler } from '../../../src/handler/RequestEventHandler';

const allowlist = [ NON_MALICIOUS_REDIRECT_URL ];

describe('createAllowedRedirectDetector', (): void => {
  let handler: ResponseEventHandler;
  let request: jest.Mocked<ClientHttp2Stream>;
  let headers: jest.Mocked<IncomingHttpHeaders>;

  beforeEach((): void => {
    handler = createAllowedRedirectDetector(allowlist);
    request = {
      close: jest.fn(),
    } as any;
  });

  it(
    'should close the request if the status code is a redirect and the location is not in the allowed list.',
    (): void => {
      headers = MALICIOUS_REDIRECT_PATHS['/malicious-redirect'].generateResponse().headers as IncomingHttpHeaders;
      handler(request, headers);
      expect(request.close).toHaveBeenCalledTimes(1);
    },
  );

  it(
    'should not close the request if the status code is a redirect and the location is in the allowed list.',
    (): void => {
      headers = MALICIOUS_REDIRECT_PATHS['/non-malicious-redirect'].generateResponse().headers as IncomingHttpHeaders;
      handler(request, headers);
      expect(request.close).not.toHaveBeenCalled();
    },
  );
});
