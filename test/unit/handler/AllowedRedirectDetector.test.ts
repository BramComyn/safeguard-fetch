import type { ClientHttp2Stream, IncomingHttpHeaders } from 'node:http2';
import { AllowedRedirectDetector } from '../../../src/handler/response/AllowedRedirectDetector';

import {
  MALICIOUS_REDIRECT_PATHS,
  NON_MALICIOUS_REDIRECT_URL,
} from '../../../src/attack-server/attackServerConstants';

const whitelist = [ NON_MALICIOUS_REDIRECT_URL ];

describe('AllowedRedirectDetector', (): void => {
  let handler: AllowedRedirectDetector;
  let request: jest.Mocked<ClientHttp2Stream>;
  let headers: jest.Mocked<IncomingHttpHeaders>;

  beforeEach((): void => {
    handler = new AllowedRedirectDetector(whitelist);
    request = {
      close: jest.fn(),
    } as any;
  });

  it(
    'should close the request if the status code is a redirect and the location is not in the allowed list.',
    (): void => {
      headers = MALICIOUS_REDIRECT_PATHS['/malicious-redirect']() as IncomingHttpHeaders;
      handler.handle(request, headers);
      expect(request.close).toHaveBeenCalledTimes(1);
    },
  );

  it(
    'should not close the request if the status code is a redirect and the location is in the allowed list.',
    (): void => {
      headers = MALICIOUS_REDIRECT_PATHS['/non-malicious-redirect']() as IncomingHttpHeaders;
      handler.handle(request, headers);
      expect(request.close).not.toHaveBeenCalled();
    },
  );

  it('should not close the request if the status code is unknown.', (): void => {
    headers = MALICIOUS_REDIRECT_PATHS['/no-status-code-redirect']() as IncomingHttpHeaders;
    handler.handle(request, headers);
    expect(request.close).not.toHaveBeenCalled();
  });
});
