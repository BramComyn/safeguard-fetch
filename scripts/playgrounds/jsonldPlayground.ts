import { AttackServer } from '../../src/attack-server/attack-server/AttackServer';
import { secureServerOptions } from '../../src/util';

import {
  AttackServerHttp2SecureFactory,
} from '../../src/attack-server/attack-server-factory/AttackServerHttp2SecureFactory';
import {
  JsonLdAttackServerHttp2Initialiser,
} from '../../src/attack-server/attack-server-initialiser/JsonLdAttackServerHttp2Initialiser';

const attackServer = new AttackServer(
  8443,
  new AttackServerHttp2SecureFactory(),
  [ new JsonLdAttackServerHttp2Initialiser() ],
  secureServerOptions,
);

attackServer.start();
