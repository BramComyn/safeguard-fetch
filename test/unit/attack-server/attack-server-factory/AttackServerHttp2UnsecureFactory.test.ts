import {
  AttackServerHttp2UnsecureFactory,
} from '../../../../src/attack-server/attack-server-factory/AttackServerHttp2UnsecureFactory';

describe('AttackServerHttp2UnsecureFactory', (): any => {
  let factory: AttackServerHttp2UnsecureFactory;

  beforeEach((): any => {
    factory = new AttackServerHttp2UnsecureFactory();
  });

  describe('createHttpServer', (): any => {
    it('should create an unsecure HTTP/2.0 server.', (): any => {
      const server = factory.createHttpServer();
      expect(server).toBeDefined();
    });
  });
});
