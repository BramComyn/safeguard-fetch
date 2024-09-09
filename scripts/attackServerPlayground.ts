import type { Server } from 'node:http';
import type { Http2SecureServer } from 'node:http2';

import { secureServerOptions } from '../src/util';
import { AttackServerHttpFactory } from '../src/attack-server/attack-server-factory/AttackServerHttpFactory';

import {
  AttackServerHttp2SecureFactory,
} from '../src/attack-server/attack-server-factory/AttackServerHttp2SecureFactory';

import {
  AttackServerHttpInitialiser,
} from '../src/attack-server/attack-server-initialiser/AttackServerHttpInitialiser';

import {
  AttackServerHttp2Initialiser,
} from '../src/attack-server/attack-server-initialiser/AttackServerHttp2Initialiser';

import { AttackServer } from '../src/attack-server/attack-server/AttackServer';

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
