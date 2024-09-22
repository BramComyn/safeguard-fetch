import { connect } from 'node:http2';
import { once } from 'node:events';

import { createRefuseContentLongerThanHandler } from '../../src/handler/examples/RefuseContentLengthLongerThanHandler';
import type { ResponseGeneratorMap } from '../../src/attack-server/attack-server-initialiser/AttackServerInitialiser';
import { createRefuseNoContentLengthHandler } from '../../src/handler/examples/RefuseNoContentLengthHandler';
import { createAllowedRedirectDetector } from '../../src/handler/examples/AllowedRedirectDetector';
import { createBannedRedirectDetector } from '../../src/handler/examples/BannedRedirectDetector';
import { AttackServer } from '../../src/attack-server/attack-server/AttackServer';
import { SafeguardRequester } from '../../src/wrapper/SafeguardRequester';
import { getPort, secureServerOptions } from '../../src/util';

import {
  AttackServerHttp2SecureFactory,
} from '../../src/attack-server/attack-server-factory/AttackServerHttp2SecureFactory';

import {
  AttackServerHttp2Initialiser,
} from '../../src/attack-server/attack-server-initialiser/AttackServerHttp2Initialiser';

import {
  CONTENT_LENGTH_PATHS,
  HTTP2_SERVER_PATHS,
  MALICIOUS_REDIRECT_PATHS,
  MALICIOUS_REDIRECT_URL,
  NON_MALICIOUS_REDIRECT_URL,
} from '../../src/attack-server/attackServerConstants';

const port = getPort('WrapperIntegration');

describe('The whole codebase', (): void => {
  const factory = new AttackServerHttp2SecureFactory();
  const generators: ResponseGeneratorMap = {
    ...HTTP2_SERVER_PATHS,
    ...CONTENT_LENGTH_PATHS,
    ...MALICIOUS_REDIRECT_PATHS,
  };

  const server = new AttackServer(
    port,
    factory,
    [ new AttackServerHttp2Initialiser(generators) ],
    secureServerOptions,
  );

  server.start();
  const client = connect(`https://localhost:${port}`, { ca: secureServerOptions.cert });
  const requester = new SafeguardRequester();

  afterAll((): void => {
    // We need to destroy the client because of the infinite responses
    client.destroy();
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
