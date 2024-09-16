import type { ClientHttp2Session, Http2SecureServer } from 'node:http2';
import { connect } from 'node:http2';

import { once } from 'node:events';

import {
  AttackServerHttp2SecureFactory,
} from '../../src/attack-server/attack-server-factory/AttackServerHttp2SecureFactory';

import {
  ContentLengthAttackServerHttp2Initialiser,
} from '../../src/attack-server/attack-server-initialiser/ContentLengthAttackServerHttp2Initialiser';

import {
  RedirectAttackServerHttp2Initialiser,
} from '../../src/attack-server/attack-server-initialiser/RedirectAttackServerHttp2Initialiser';

import { AttackServer } from '../../src/attack-server/attack-server/AttackServer';
import { getPort, secureServerOptions } from '../../src/util';
import { SafeguardRequester } from '../../src/wrapper/SafeguardRequester';
import { createRefuseContentLongerThanHandler } from '../../src/handler/response/RefuseContentLengthLongerThanHandler';
import { createAllowedRedirectDetector } from '../../src/handler/response/AllowedRedirectDetector';
import { MALICIOUS_REDIRECT_URL, NON_MALICIOUS_REDIRECT_URL } from '../../src/attack-server/attackServerConstants';
import { createBannedRedirectDetector } from '../../src/handler/response/BannedRedirectDetector';
import { createRefuseNoContentLengthHandler } from '../../src/handler/response/RefuseNoContentLengthHandler';

const port = getPort('WrapperIntegration');

describe('The whole codebase', (): void => {
  // Server setup
  let server: AttackServer<Http2SecureServer>;
  let factory: AttackServerHttp2SecureFactory;
  let contentLengthInitialiser: ContentLengthAttackServerHttp2Initialiser;
  let redirectInitialiser: RedirectAttackServerHttp2Initialiser;

  let client: ClientHttp2Session;

  let requester: SafeguardRequester;

  beforeAll((): void => {
    factory = new AttackServerHttp2SecureFactory();
    contentLengthInitialiser = new ContentLengthAttackServerHttp2Initialiser();
    redirectInitialiser = new RedirectAttackServerHttp2Initialiser();
    server = new AttackServer(port, factory, [ contentLengthInitialiser, redirectInitialiser ], secureServerOptions);

    server.start();
    client = connect(`https://localhost:${port}`, { ca: secureServerOptions.cert });
    requester = new SafeguardRequester();
  });

  beforeEach((): void => {});

  afterEach((): void => {});

  afterAll((): void => {
    client.close();
    server.stop();
  });

  it(
    'should setup the server correctly as both a redirect and content length attack server.',
    async(): Promise<void> => {
      const contentLengthRequest = client.request({ ':path': '/no-difference' });
      const redirectRequest = client.request({ ':path': '/malicious-redirect' });

      await expect(
        once(contentLengthRequest, 'response'),
      ).resolves.toBeDefined();

      await expect(
        once(redirectRequest, 'response'),
      ).resolves.toBeDefined();

      contentLengthRequest.close();
      redirectRequest.close();
    },
  );

  describe('should protect from the following attacks:', (): void => {
    beforeAll((): void => {
      const contentLengthHandler = createRefuseContentLongerThanHandler(100);
      const noContentLengthHandler = createRefuseNoContentLengthHandler();
      const allowedRedirectHandler = createAllowedRedirectDetector([ NON_MALICIOUS_REDIRECT_URL ]);
      const bannedRedirectHandler = createBannedRedirectDetector([ MALICIOUS_REDIRECT_URL ]);
      const handlers = [ contentLengthHandler, noContentLengthHandler, allowedRedirectHandler, bannedRedirectHandler ];

      for (const handler of handlers) {
        requester.addRequestEventHandler('response', handler);
      }
    });

    it('content length too long.', async(): Promise<void> => {
      const noContentLengthRequest = requester.request(client, { ':path': '/no-difference' });
      jest.spyOn(noContentLengthRequest, 'close');

      await expect(
        once(noContentLengthRequest, 'response'),
      ).resolves.toBeDefined();

      expect(noContentLengthRequest.close).toHaveBeenCalledTimes(1);
    });

    it('content length not specified.', async(): Promise<void> => {
      const contentLengthTooLongRequest = requester.request(client, { ':path': '/no-content-length-finite' });
      jest.spyOn(contentLengthTooLongRequest, 'close');

      await expect(
        once(contentLengthTooLongRequest, 'response'),
      ).resolves.toBeDefined();

      expect(contentLengthTooLongRequest.close).toHaveBeenCalledTimes(1);
    });

    it('redirect to a banned URL.', async(): Promise<void> => {
      const bannedRedirectRequest = requester.request(client, { ':path': '/malicious-redirect' });
      jest.spyOn(bannedRedirectRequest, 'close');

      await expect(
        once(bannedRedirectRequest, 'response'),
      ).resolves.toBeDefined();

      expect(bannedRedirectRequest.close).toHaveBeenCalledTimes(1);
    });

    it('redirect to an allowed URL.', async(): Promise<void> => {
      const allowedRedirectRequest = requester.request(client, { ':path': '/non-malicious-redirect' });
      jest.spyOn(allowedRedirectRequest, 'close');

      await expect(
        once(allowedRedirectRequest, 'response'),
      ).resolves.toBeDefined();

      expect(allowedRedirectRequest.close).not.toHaveBeenCalled();
    });
  });
});
