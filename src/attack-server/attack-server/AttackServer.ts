import type { Server } from 'node:http';
import type { Http2SecureServer, Http2Server } from 'node:http2';

import type { AttackServerFactory } from '../attack-server-factory/AttackServerFactory';

// An attack server for testing purposes
// port: the port the server will listen to
// server: the attacking server
// startServer: starts the server and makes it listen to the defined port
export abstract class AttackServer {
  private readonly port: number;
  protected readonly server: Server | Http2Server | Http2SecureServer;
  protected started = false;

  public constructor(port: number, attackServerFactory: AttackServerFactory) {
    this.port = port;
    this.server = attackServerFactory.createHttpServer();
  }

  // Starts the server and makes it listen to the defined port
  public startServer(): void {
    if (!this.started) {
      this.initiateServer();
      this.server.listen(this.port);
      console.log(`Server listening on localhost:${this.port}`);
      this.started = !this.started;
    }
  }

  // Initiates the server by specifying its behaviour
  protected abstract initiateServer(): void;
}
