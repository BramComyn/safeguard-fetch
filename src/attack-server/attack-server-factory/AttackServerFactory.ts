import type { Server } from 'node:net';

/**
 * Type for server factories
 *
 * @method createServer - creates a server of the desired type
 */
export interface AttackServerFactory<T extends Server> {
  /**
   * Creates a server of the desired type
   *
   * @returns the desired server
   */
  createServer: (options: object) => T;
}
