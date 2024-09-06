import type { Server } from 'node:net';

/**
 * Interface for initialising the attack server.
 */
export interface AttackServerInitialiser<T extends Server> {
  /**
   * Initialises a server with the necessary event listeners.
   *
   * @param server The server to be initialised.
   */
  intialize: (server: T) => void;
}
