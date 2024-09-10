import type { ClientHttp2Stream } from 'node:http2';
import { MALICIOUS_REDIRECT_URL, NON_MALICIOUS_REDIRECT_URL } from '../../../src/attack-server/attackServerConstants';
import { createBannedRedirectHandler, createWhitelistedRedirectHandler } from '../../../src/handler/redirectHandlers';

describe('redirectHandlers', (): any => {
  let request: jest.Mocked<ClientHttp2Stream>;
  let headers: { location: string };

  beforeEach((): any => {
    request = {
      close: jest.fn(),
    } as any;
  });

  describe('detectBannedRedirect', (): any => {
    const banned = [ MALICIOUS_REDIRECT_URL ];
    const bannedRedirectHandler = createBannedRedirectHandler(banned);

    it('should close the request if the location is banned.', (): any => {
      headers = { location: MALICIOUS_REDIRECT_URL };
      bannedRedirectHandler(request, headers);
      expect(request.close).toHaveBeenCalledTimes(1);
    });

    it('should not close the request if the location is not banned.', (): any => {
      headers = { location: NON_MALICIOUS_REDIRECT_URL };
      bannedRedirectHandler(request, headers);
      expect(request.close).not.toHaveBeenCalled();
    });
  });

  describe('detectWhitelistedRedirect', (): any => {
    const allowed = [ NON_MALICIOUS_REDIRECT_URL ];
    const allowedRedirectHandler = createWhitelistedRedirectHandler(allowed);

    it('should close the request if the location is not whitelisted.', (): any => {
      headers = { location: MALICIOUS_REDIRECT_URL };
      allowedRedirectHandler(request, headers);
      expect(request.close).toHaveBeenCalledTimes(1);
    });

    it('should not close the request if the location is whitelisted.', (): any => {
      headers = { location: NON_MALICIOUS_REDIRECT_URL };
      allowedRedirectHandler(request, headers);
      expect(request.close).not.toHaveBeenCalled();
    });
  });
});
