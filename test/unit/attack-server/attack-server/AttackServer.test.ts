import type { Server } from 'node:http';

import type { AttackServerFactory } from '../../../../src/attack-server/attack-server-factory/AttackServerFactory';
import { AttackServer } from '../../../../src/attack-server/attack-server/AttackServer';

import type {
  AttackServerInitialiser,
} from '../../../../src/attack-server/attack-server-initialiser/AttackServerInitialiser';

// An attack server for testing purposes
class DummyAttackServer extends AttackServer<Server> {
  public constructor(
    port: number,
    attackServerFactory: AttackServerFactory<Server>,
    attackServerInitialiser: AttackServerInitialiser<Server>,
  ) {
    super(port, attackServerFactory, attackServerInitialiser);
  }
}

describe('AttackServer', (): any => {
  let initialiser: jest.Mocked<AttackServerInitialiser<Server>>;
  let factory: jest.Mocked<AttackServerFactory<Server>>;
  let server: jest.Mocked<Server>;

  beforeEach((): any => {
    server = {
      listen: jest.fn(),
    } as any;

    factory = {
      createServer: jest.fn().mockReturnValue(server),
    };

    initialiser = {
      intialize: jest.fn(),
    };
  });

  it('should create a server using the factory.', (): any => {
    const attackServer = new DummyAttackServer(8080, factory, initialiser);
    attackServer.start();

    expect(factory.createServer).toHaveBeenCalledWith({});
    expect(factory.createServer).toHaveBeenCalledTimes(1);
    expect(server.listen).toHaveBeenCalledWith(8080);
  });
});
