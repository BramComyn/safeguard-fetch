import type { Server } from 'node:net';

import type { ResponseGenerator } from '../../response-generator/ResponseGenerator';

/**
 * Interface for initializing the attack server.
 *
 * @method initialise - initialises the server with the necessary event listeners
 */
export interface AttackServerInitialiser<T extends Server> {
  /**
   * Initialises a server with the necessary event listeners.
   *
   * @param server The server to be initialised.
   */
  initialise: (server: T) => void;
}

/**
 * Map of response generators for a given path
 */
export type ResponseGeneratorMap = Record<string, ResponseGenerator>;
