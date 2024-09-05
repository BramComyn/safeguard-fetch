import {
  AttackServerHttpFactory,
} from '../../../../src/attack-server/attack-server-factory/AttackServerHttpFactory';

describe('AttackServerHttpFactory', (): any => {
  let factory: AttackServerHttpFactory;

  beforeEach((): any => {
    factory = new AttackServerHttpFactory();
  });

  describe('createHttpServer', (): any => {
    it('should create an HTTP/1.1 server.', (): any => {
      const server = factory.createHttpServer();
      expect(server).toBeDefined();
    });
  });
});
