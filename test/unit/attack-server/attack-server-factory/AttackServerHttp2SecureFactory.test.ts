import {
  AttackServerHttp2SecureFactory,
} from '../../../../src/attack-server/attack-server-factory/AttackServerHttp2SecureFactory';

import { secureServerOptions } from '../../../../src/util';

describe('AttackServerHttp2SecureFactory', (): any => {
  let factory: AttackServerHttp2SecureFactory;

  beforeEach((): any => {
    factory = new AttackServerHttp2SecureFactory();
  });

  describe('createHttpServer', (): any => {
    it('should create a secure HTTP/2.0 server.', (): any => {
      const server = factory.createServer(secureServerOptions);
      expect(server).toBeDefined();
    });
  });
});
