/* eslint-disable ts/naming-convention */
import { connect } from 'node:http2';

import {
  AttackServerHttp2SecureFactory,
} from '../../src/attack-server/attack-server-factory/AttackServerHttp2SecureFactory';

import {
  RedirectAttackServerHttp2Initialiser,
} from '../../src/attack-server/attack-server-initialiser/RedirectAttackServerHttp2Initialiser';

import { AttackServer } from '../../src/attack-server/attack-server/AttackServer';
import { secureServerOptions } from '../../src/util';
import { wrapperRedirect } from '../../src/wrapper-redirect/wrapperRedirect';
import { HTTPS_PORT } from '../../src/attack-server/attackServerConstants';

const server = new AttackServer(
  HTTPS_PORT,
  new AttackServerHttp2SecureFactory(),
  new RedirectAttackServerHttp2Initialiser(),
  secureServerOptions,
);

server.startServer();

const client = connect(`https://localhost:${HTTPS_PORT}`, { ca: secureServerOptions.cert });
wrapperRedirect(client, { ':path': '/malicious-redirect' }, {}, [ 'malicious-redirect.org' ]);
