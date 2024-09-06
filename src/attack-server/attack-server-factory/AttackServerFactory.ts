import type { Server } from 'node:net';

/**
 * Interface for server factories
 */
export interface AttackServerFactory {
  /**
   * Creates a server of the desired type
   *
   * @returns the desired server
   */
  createServer: (options: object) => Server;
}
