import type { ClientHttp2Session, Http2SecureServer, OutgoingHttpHeaders } from 'node:http2';
import { connect } from 'node:http2';

import {
  AttackServerHttp2SecureFactory,
} from '../../../src/attack-server/attack-server-factory/AttackServerHttp2SecureFactory';

import {
  HTTPS_PORT,
  NON_MALICIOUS_REDIRECT_PATH,
  STD_MALICIOUS_REDIRECT_PATH,
} from '../../../src/attack-server/attackServerConstants';

import {
  RedirectAttackServerHttp2Initialiser,
} from '../../../src/attack-server/attack-server-initialiser/RedirectAttackServerHttp2Initialiser';

import { AttackServer } from '../../../src/attack-server/attack-server/AttackServer';
import { wrapperRedirect } from '../../../src/wrapper-redirect/wrapperRedirect';
import { secureServerOptions } from '../../../src/util';

describe('wrapperRedirect', (): void => {
  let server: AttackServer<Http2SecureServer>;
  let port: number;

  let client: ClientHttp2Session;
  let headers: OutgoingHttpHeaders;
  let banList: string[];

  beforeAll((): void => {
    const factory = new AttackServerHttp2SecureFactory();
    const initialiser = new RedirectAttackServerHttp2Initialiser();

    port = HTTPS_PORT;

    server = new AttackServer<Http2SecureServer>(port, factory, initialiser, secureServerOptions);
    server.start();
  });

  beforeEach((): void => {
    client = connect(`https://localhost:${port}`, { ca: secureServerOptions.cert });
    banList = [ 'malicious-redirect.org' ];
  });

  afterEach((): void => {
    client.close();
  });

  afterAll((): void => {
    server.stop();
  });

  it('should throw an error when a redirect is detected to a hostname in the ban list.', async(): Promise<void> => {
    headers = { ':path': STD_MALICIOUS_REDIRECT_PATH };

    await expect(
      wrapperRedirect(client, headers, {}, banList),
    ).rejects.toThrow(`Redirecting to malicious-redirect.org is prohibited.`);
  });

  it(
    'should not throw an error when a redirect is detected to a hostname not in the ban list.',
    async(): Promise<void> => {
      headers = { ':path': NON_MALICIOUS_REDIRECT_PATH };

      await expect(
        wrapperRedirect(client, headers, {}, banList),
      ).resolves.toBeTruthy();
    },
  );
});
