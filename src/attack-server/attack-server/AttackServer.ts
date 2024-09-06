import type { Server } from 'node:net';
import type { Server as HttpServer } from 'node:http';
import type { Http2Server } from 'node:http2';

import type { AttackServerFactory } from '../attack-server-factory/AttackServerFactory';
import type { AttackServerInitialiser } from '../attack-server-initialiser/AttackServerInitialiser';

/**
 * An attack server for testing purposes
 * port: the port the server will listen to
 * server: the attacking server
 * startServer: starts the server and makes it listen to the defined port
 */
export class AttackServer<T extends Server> {
  private readonly port: number;
  protected readonly server: T;
  protected started = false;

  public constructor(
    port: number,
    attackServerFactory: AttackServerFactory<T>,
    attackServerInitialiser: AttackServerInitialiser<T>,
    options?: object,
  ) {
    this.port = port;
    this.server = attackServerFactory.createServer(options ?? {});
    attackServerInitialiser.intialize(this.server);
  }

  /**
   * Starts the server and makes it listen to the defined port
   */
  public startServer(): void {
    if (!this.started) {
      this.server.listen(this.port);
      this.started = !this.started;
    }
  }
}

export type AttackServerHttp = AttackServer<HttpServer>;
export type AttackerServerHttp2 = AttackServer<Http2Server>;
