import type { Server } from 'node:net';

/**
 * Type for initialising the attack server.
 *
 * @method intialize - initialises the server with the necessary event listeners
 */
export interface AttackServerInitialiser<T extends Server> {
  /**
   * Initialises a server with the necessary event listeners.
   *
   * @param server The server to be initialised.
   */
  intialize: (server: T) => void;
}
