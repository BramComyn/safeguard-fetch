import type { Server } from 'node:http';
import type { AttackServerFactory } from '../../../../src/attack-server/attack-server-factory/AttackServerFactory';
import { AttackServer } from '../../../../src/attack-server/attack-server/AttackServer';

// An attack server for testing purposes
class DummyAttackServer extends AttackServer {
  public constructor(port: number, attackServerFactory: AttackServerFactory) {
    super(port, attackServerFactory);
  }

  public initiateServer(): void {
    // Do nothing
  }
}

describe('AttackServer', (): any => {
  let factory: jest.Mocked<AttackServerFactory>;
  let server: jest.Mocked<Server>;

  beforeEach((): any => {
    server = {
      listen: jest.fn(),
    } as any;

    factory = {
      createServer: jest.fn().mockReturnValue(server),
    };
  });

  it('should create a server using the factory.', (): any => {
    const attackServer = new DummyAttackServer(8080, factory);
    attackServer.startServer();

    expect(factory.createServer).toHaveBeenCalledWith({});
    expect(factory.createServer).toHaveBeenCalledTimes(1);
    expect(server.listen).toHaveBeenCalledWith(8080);
  });
});
