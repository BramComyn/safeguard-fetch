import type { Server } from 'node:http';

import type { AttackServerFactory } from '../../../../src/attack-server/attack-server-factory/AttackServerFactory';
import { AttackServer } from '../../../../src/attack-server/attack-server/AttackServer';

import type {
  AttackServerInitialiser,
} from '../../../../src/attack-server/attack-server-initialiser/AttackServerInitialiser';

import { getPort } from '../../../../src/util';

const TEST_NAME = 'AttackServerUnit';
const port = getPort(TEST_NAME);

// An attack server for testing purposes
class DummyAttackServer extends AttackServer<Server> {
  public constructor(
    port: number,
    attackServerFactory: AttackServerFactory<Server>,
    attackServerInitialisers: AttackServerInitialiser<Server>[],
  ) {
    super(port, attackServerFactory, attackServerInitialisers);
  }

  public get started(): boolean {
    return this._started;
  }
}

describe('AttackServer', (): any => {
  let initialiser: jest.Mocked<AttackServerInitialiser<Server>>;
  let factory: jest.Mocked<AttackServerFactory<Server>>;
  let server: jest.Mocked<Server>;
  let attackServer: DummyAttackServer;

  beforeEach((): any => {
    server = {
      listen: jest.fn(),
      close: jest.fn(),
    } as any;

    factory = {
      createServer: jest.fn().mockReturnValue(server),
    };

    initialiser = {
      intialize: jest.fn(),
    };

    attackServer = new DummyAttackServer(port, factory, [ initialiser ]);
  });

  it('should create a server using the factory.', (): any => {
    expect(factory.createServer).toHaveBeenCalledWith({});
    expect(factory.createServer).toHaveBeenCalledTimes(1);

    expect(initialiser.intialize).toHaveBeenCalledWith(server);
    expect(initialiser.intialize).toHaveBeenCalledTimes(1);
  });

  it('should start the server.', (): any => {
    expect(attackServer.started).toBe(false);

    attackServer.start();

    expect(attackServer.started).toBe(true);
    expect(server.listen).toHaveBeenCalledWith(port);
    expect(server.listen).toHaveBeenCalledTimes(1);
  });

  it ('should stop the server.', (): any => {
    expect(attackServer.started).toBe(false);
    attackServer.start();
    expect(attackServer.started).toBe(true);
    attackServer.stop();
    expect(attackServer.started).toBe(false);

    expect(server.close).toHaveBeenCalledWith();
    expect(server.close).toHaveBeenCalledTimes(1);
  });
});
