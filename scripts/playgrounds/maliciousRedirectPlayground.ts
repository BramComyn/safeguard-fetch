import type { ClientHttp2Stream, Http2SecureServer, IncomingHttpHeaders } from 'node:http2';
import { connect } from 'node:http2';

import {
  AttackServerHttp2SecureFactory,
} from '../../src/attack-server/attack-server-factory/AttackServerHttp2SecureFactory';

import {
  RedirectAttackServerHttp2Initialiser,
} from '../../src/attack-server/attack-server-initialiser/RedirectAttackServerHttp2Initialiser';

import { AttackServer } from '../../src/attack-server/attack-server/AttackServer';
import { secureServerOptions } from '../../src/util';
import { setRedirectHandler } from '../../src/wrapper/redirect';
import { HTTPS_PORT } from '../../src/attack-server/attackServerConstants';

const server = new AttackServer<Http2SecureServer>(
  HTTPS_PORT,
  new AttackServerHttp2SecureFactory(),
  new RedirectAttackServerHttp2Initialiser(),
  secureServerOptions,
);

server.start();

const client = connect(`https://localhost:${HTTPS_PORT}`, { ca: secureServerOptions.cert });
const request = client.request({ ':path': '/malicious-redirect' });

function redirectHandler(request: ClientHttp2Stream, headers: IncomingHttpHeaders): void {
  console.log('Redirected to:', headers.location);
  client.close();
  server.stop();
}

setRedirectHandler(request, redirectHandler).catch(console.error);
