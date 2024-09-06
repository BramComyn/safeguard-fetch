import type { Server } from 'node:net';

import type { AttackServerFactory } from '../attack-server-factory/AttackServerFactory';

/**
 * An attack server for testing purposes
 * port: the port the server will listen to
 * server: the attacking server
 * startServer: starts the server and makes it listen to the defined port
 */
export abstract class AttackServer {
  private readonly port: number;
  protected readonly server: Server;
  protected started = false;

  public constructor(port: number, attackServerFactory: AttackServerFactory, options?: object) {
    this.port = port;
    this.server = attackServerFactory.createServer(options ?? {});
  }

  /**
   * Starts the server and makes it listen to the defined port
   */
  public startServer(): void {
    if (!this.started) {
      this.initiateServer();
      this.server.listen(this.port);
      this.started = !this.started;
    }
  }

  /**
   * Initiates the server by specifying its behaviour
   */
  protected abstract initiateServer(): void;
}
