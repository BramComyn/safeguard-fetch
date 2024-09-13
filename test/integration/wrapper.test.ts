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

const port = getPort('WrapperIntegration');

describe('The Wrapper', (): void => {
  // Server setup
  let server: AttackServer<Http2SecureServer>;
  let factory: AttackServerHttp2SecureFactory;
  let contentLengthInitialiser: ContentLengthAttackServerHttp2Initialiser;
  let redirectInitialiser: RedirectAttackServerHttp2Initialiser;

  let client: ClientHttp2Session;

  beforeAll((): void => {
    factory = new AttackServerHttp2SecureFactory();
    contentLengthInitialiser = new ContentLengthAttackServerHttp2Initialiser();
    redirectInitialiser = new RedirectAttackServerHttp2Initialiser();
    server = new AttackServer(port, factory, [ contentLengthInitialiser, redirectInitialiser ], secureServerOptions);

    server.start();
    client = connect(`https://localhost:${port}`, { ca: secureServerOptions.cert });
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
});
