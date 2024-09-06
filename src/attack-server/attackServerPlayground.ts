import type { Server } from 'node:http';
import type { Http2SecureServer } from 'node:http2';

import { secureServerOptions } from '../util';
import { AttackServerHttpFactory } from './attack-server-factory/AttackServerHttpFactory';
import { AttackServerHttp2SecureFactory } from './attack-server-factory/AttackServerHttp2SecureFactory';
import { AttackServerHttpInitialiser } from './attack-server-initialiser/AttackServerHttpInitialiser';
import { AttackServerHttp2Initialiser } from './attack-server-initialiser/AttackServerHttp2Initialiser';
import { AttackServer } from './attack-server/AttackServer';

const httpserver = new AttackServer<Server>(8080, new AttackServerHttpFactory(), new AttackServerHttpInitialiser());
httpserver.startServer();

const http2secureServer =
  new AttackServer<Http2SecureServer>(
    8443,
    new AttackServerHttp2SecureFactory(),
    new AttackServerHttp2Initialiser(),
    secureServerOptions,
  );
http2secureServer.startServer();
