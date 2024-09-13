import type { ClientHttp2Stream, IncomingHttpHeaders } from 'node:http2';
import { BannedRedirectDetector } from '../../../src/handler/response/BannedRedirectDetector';

import {
  MALICIOUS_REDIRECT_PATHS,
  MALICIOUS_REDIRECT_URL,
} from '../../../src/attack-server/attackServerConstants';

const blacklist = [ MALICIOUS_REDIRECT_URL ];

describe('BannedRedirectDetector', (): void => {
  let handler: BannedRedirectDetector;
  let request: jest.Mocked<ClientHttp2Stream>;
  let headers: jest.Mocked<IncomingHttpHeaders>;

  beforeEach((): void => {
    handler = new BannedRedirectDetector(blacklist);
    request = {
      close: jest.fn(),
    } as any;
  });

  it('should close the request if the status code is a redirect and the location is in the banned list.', (): void => {
    headers = MALICIOUS_REDIRECT_PATHS['/malicious-redirect']() as IncomingHttpHeaders;
    handler.handle(request, headers);
    expect(request.close).toHaveBeenCalledTimes(1);
  });

  it(
    'should not close the request if the status code is a redirect and the location is not in the banned list.',
    (): void => {
      headers = MALICIOUS_REDIRECT_PATHS['/non-malicious-redirect']() as IncomingHttpHeaders;
      handler.handle(request, headers);
      expect(request.close).not.toHaveBeenCalled();
    },
  );

  it('should close the request if the status code is unknown.', (): void => {
    headers = MALICIOUS_REDIRECT_PATHS['/no-status-code-redirect']() as IncomingHttpHeaders;
    handler.handle(request, headers);
    expect(request.close).toHaveBeenCalledTimes(1);
  });
});
