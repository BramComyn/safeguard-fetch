import { connect } from 'node:http2';
import type { ClientHttp2Session, ClientHttp2Stream, Http2SecureServer } from 'node:http2';

import {
  AttackServerHttp2SecureFactory,
} from '../../src/attack-server/attack-server-factory/AttackServerHttp2SecureFactory';

import {
  RedirectAttackServerHttp2Initialiser,
} from '../../src/attack-server/attack-server-initialiser/RedirectAttackServerHttp2Initialiser';

import {
  ContentLengthAttackServerHttp2Initialiser,
} from '../../src/attack-server/attack-server-initialiser/ContentLengthAttackServerHttp2Initialiser';

import { AttackServer } from '../../src/attack-server/attack-server/AttackServer';
import { getPort, secureServerOptions } from '../../src/util';
import { MALICIOUS_REDIRECT_URL, NON_MALICIOUS_REDIRECT_URL } from '../../src/attack-server/attackServerConstants';
import { createContentLengthHandler, createNoContentLengthHandler } from '../../src/handler/contentLengthHandlers';
import { createBannedRedirectHandler, createWhitelistedRedirectHandler } from '../../src/handler/redirectHandlers';
import { setRedirectHandler } from '../../src/wrapper/redirect';
import { setContentLengthHandler, setNoContentLengthHandler } from '../../src/wrapper/contentLength';

const port = getPort('wrappersIntegration');

describe('setRedirectHandler', (): void => {
  const bannedRedirectHandler = createBannedRedirectHandler([ MALICIOUS_REDIRECT_URL ]);
  const allowedRedirectHandler = createWhitelistedRedirectHandler([ NON_MALICIOUS_REDIRECT_URL ]);

  let server: AttackServer<Http2SecureServer>;
  let client: ClientHttp2Session;
  let request: ClientHttp2Stream;

  beforeAll((): void => {
    const factory = new AttackServerHttp2SecureFactory();
    const initialiser = new RedirectAttackServerHttp2Initialiser();

    server = new AttackServer<Http2SecureServer>(
      port,
      factory,
      initialiser,
      secureServerOptions,
    );

    server.start();
    client = connect(`https://localhost:${port}`, { ca: secureServerOptions.cert });
  });

  afterAll((): void => {
    client.close();
    server.stop();
  });

  it('can have a banlist.', async(): Promise<void> => {
    // Block the malicious redirect
    request = client.request({ ':path': '/malicious-redirect' });
    jest.spyOn(request, 'close');

    await setRedirectHandler(request, bannedRedirectHandler);
    expect(request.close).toHaveBeenCalledTimes(1);

    // Allow the non-malicious redirect
    request = client.request({ ':path': '/non-malicious-redirect' });
    jest.spyOn(request, 'close');

    await setRedirectHandler(request, bannedRedirectHandler);
    expect(request.close).not.toHaveBeenCalled();
    request.close();
  });

  it('can have a whitelist.', async(): Promise<void> => {
    // Allow the non-malicious redirect
    request = client.request({ ':path': '/non-malicious-redirect' });
    jest.spyOn(request, 'close');

    await setRedirectHandler(request, allowedRedirectHandler);
    expect(request.close).not.toHaveBeenCalled();
    request.close();

    // Block the malicious redirect
    request = client.request({ ':path': '/malicious-redirect' });
    jest.spyOn(request, 'close');

    await setRedirectHandler(request, allowedRedirectHandler);
    expect(request.close).toHaveBeenCalledTimes(1);
  });
});

describe('setContentLengthHandler', (): any => {
  const maxAllowedContentLengthHandler = createContentLengthHandler(100);

  let server: AttackServer<Http2SecureServer>;
  let client: ClientHttp2Session;
  let request: ClientHttp2Stream;

  beforeAll((): void => {
    const factory = new AttackServerHttp2SecureFactory();
    const initialiser = new ContentLengthAttackServerHttp2Initialiser();

    server = new AttackServer<Http2SecureServer>(
      port,
      factory,
      initialiser,
      secureServerOptions,
    );

    server.start();
    client = connect(`https://localhost:${port}`, { ca: secureServerOptions.cert });
  });

  afterAll((): void => {
    client.close();
    server.stop();
  });

  it('can refuse to handle a response with a content length that is too long.', async(): Promise<void> => {
    request = client.request({ ':path': '/no-difference' });
    jest.spyOn(request, 'close');

    await setContentLengthHandler(request, maxAllowedContentLengthHandler);
    expect(request.close).toHaveBeenCalledTimes(1);

    request = client.request({ ':path': '/large-difference' });
    jest.spyOn(request, 'close');

    await setContentLengthHandler(request, maxAllowedContentLengthHandler);
    expect(request.close).not.toHaveBeenCalled();
    request.close();
  });
});

describe('setNoContentLengthHandler', (): any => {
  const noContentLengthHandler = createNoContentLengthHandler();

  let server: AttackServer<Http2SecureServer>;
  let client: ClientHttp2Session;
  let request: ClientHttp2Stream;

  beforeAll((): void => {
    const factory = new AttackServerHttp2SecureFactory();
    const initialiser = new ContentLengthAttackServerHttp2Initialiser();

    server = new AttackServer<Http2SecureServer>(
      port,
      factory,
      initialiser,
      secureServerOptions,
    );

    server.start();
    client = connect(`https://localhost:${port}`, { ca: secureServerOptions.cert });
  });

  afterAll((): void => {
    client.close();
    server.stop();
  });

  it('can refuse to handle a response with no content length.', async(): Promise<void> => {
    request = client.request({ ':path': '/no-content-length-finite' });
    jest.spyOn(request, 'close');

    await setNoContentLengthHandler(request, noContentLengthHandler);
    expect(request.close).toHaveBeenCalledTimes(1);

    request = client.request({ ':path': '/no-difference' });
    jest.spyOn(request, 'close');

    await setNoContentLengthHandler(request, noContentLengthHandler);
    expect(request.close).not.toHaveBeenCalled();
    request.close();
  });
});
