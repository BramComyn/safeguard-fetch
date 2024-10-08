import type { Server } from 'node:net';
import type { Server as HttpServer } from 'node:http';
import type { Http2Server } from 'node:http2';

import type { AttackServerFactory } from '../attack-server-factory/AttackServerFactory';
import type { AttackServerInitialiser } from '../attack-server-initialiser/AttackServerInitialiser';

/**
 * An attack server for testing purposes
 *
 * @member port - the port the server will listen to
 * @member server - the attacking server
 * @member started - whether the server has been started
 * @method startServer - starts the server and makes it listen to the defined port
 */
export class AttackServer<T extends Server> {
  protected readonly port: number;
  protected readonly server: T;
  protected _started = false;

  /**
   * Creates a new instance of the attack server
   *
   * @param port - the desired port to start the server on
   * @param attackServerFactory - the factory to create the server
   * @param attackServerInitialisers - the initialisers to initialise the server
   * @param options - options to pass to the server factory
   */
  public constructor(
    port: number,
    attackServerFactory: AttackServerFactory<T>,
    attackServerInitialisers: AttackServerInitialiser<T>[],
    options?: object,
  ) {
    this.port = port;
    this.server = attackServerFactory.createServer(options ?? {});

    for (const initialiser of attackServerInitialisers) {
      initialiser.initialise(this.server);
    }
  }

  /**
   * Starts the server and makes it listen to the defined port
   */
  public start(): void {
    if (!this._started) {
      this.server.listen(this.port);
      this._started = !this._started;
    }
  }

  /**
   * Stops the server
   */
  public stop(): void {
    if (this._started) {
      this.server.close();
      this._started = !this._started;
    }
  }
}

export type AttackServerHttp = AttackServer<HttpServer>;
export type AttackerServerHttp2 = AttackServer<Http2Server>;
