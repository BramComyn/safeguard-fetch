import type { Server } from 'node:http';
import type { Http2SecureServer } from 'node:http2';

import { secureServerOptions } from '../../src/util';
import { AttackServerHttpFactory } from '../../src/attack-server/attack-server-factory/AttackServerHttpFactory';

import {
  AttackServerHttp2SecureFactory,
} from '../../src/attack-server/attack-server-factory/AttackServerHttp2SecureFactory';

import {
  ContentLengthAttackServerHttpInitializer,
} from '../../src/attack-server/attack-server-initializer/ContentLengthAttackServerHttpInitializer';

import {
  ContentLengthAttackServerHttp2Initializer,
} from '../../src/attack-server/attack-server-initializer/ContentLengthAttackServerHttp2Initializer';

import {
  RedirectAttackServerHttp2Initializer,
} from '../../src/attack-server/attack-server-initializer/RedirectAttackServerHttp2Initializer';

import { AttackServer } from '../../src/attack-server/attack-server/AttackServer';

const httpserver = new AttackServer<Server>(
  8080,
  new AttackServerHttpFactory(),
  [ new ContentLengthAttackServerHttpInitializer() ],
);

httpserver.start();

const http2secureServer =
  new AttackServer<Http2SecureServer>(
    8443,
    new AttackServerHttp2SecureFactory(),
    [ new ContentLengthAttackServerHttp2Initializer(), new RedirectAttackServerHttp2Initializer() ],
    secureServerOptions,
  );
http2secureServer.start();
