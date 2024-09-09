import type { ClientHttp2Session, ClientHttp2Stream, Http2SecureServer, OutgoingHttpHeaders } from 'node:http2';
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
import { setRedirectHandler } from '../../../src/wrapper/redirect';
import { secureServerOptions } from '../../../src/util';

describe('setRedirectHandler', (): void => {
  let redirectHandler: jest.Mock;
  let server: AttackServer<Http2SecureServer>;
  let port: number;

  let client: ClientHttp2Session;
  let headers: OutgoingHttpHeaders;
  let request: ClientHttp2Stream;

  beforeAll((): void => {
    const factory = new AttackServerHttp2SecureFactory();
    const initialiser = new RedirectAttackServerHttp2Initialiser();

    port = HTTPS_PORT;

    server = new AttackServer<Http2SecureServer>(port, factory, initialiser, secureServerOptions);
    server.start();
  });

  beforeEach((): void => {
    client = connect(`https://localhost:${port}`, { ca: secureServerOptions.cert });
    redirectHandler = jest.fn();
  });

  afterEach((): void => {
    client.close();
  });

  afterAll((): void => {
    server.stop();
  });

  it('should call redirectHandler upon redirect status code.', async(): Promise<void> => {
    headers = { ':path': STD_MALICIOUS_REDIRECT_PATH };
    request = client.request(headers);

    await setRedirectHandler(request, redirectHandler);
    expect(redirectHandler).toHaveBeenCalledTimes(1);
  });

  it('should not call redirectHandler upon non-redirect status code.', async(): Promise<void> => {
    headers = { ':path': NON_MALICIOUS_REDIRECT_PATH };
    request = client.request(headers);

    await setRedirectHandler(request, redirectHandler);
    expect(redirectHandler).not.toHaveBeenCalled();
  });
});
