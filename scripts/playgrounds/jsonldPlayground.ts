import { AttackServer } from '../../src/attack-server/attack-server/AttackServer';
import { secureServerOptions } from '../../src/util';

import {
  AttackServerHttp2SecureFactory,
} from '../../src/attack-server/attack-server-factory/AttackServerHttp2SecureFactory';
import {
  JsonLdAttackServerHttp2Initializer,
} from '../../src/attack-server/attack-server-initializer/JsonLdAttackServerHttp2Initializer';

const attackServer = new AttackServer(
  8443,
  new AttackServerHttp2SecureFactory(),
  [ new JsonLdAttackServerHttp2Initializer() ],
  secureServerOptions,
);

attackServer.start();
