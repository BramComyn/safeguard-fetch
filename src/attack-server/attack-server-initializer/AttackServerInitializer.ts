import type { Server } from 'node:net';

import type { ResponseGenerator } from '../../response-generator/ResponseGenerator';

/**
 * Interface for initializing the attack server.
 *
 * @method initialize - initializes the server with the necessary event listeners
 */
export interface AttackServerInitializer<T extends Server> {
  /**
   * Initializes a server with the necessary event listeners.
   *
   * @param server The server to be initialized.
   */
  initialize: (server: T) => void;
}

/**
 * Map of response generators for a given path
 */
export type ResponseGeneratorMap = Record<string, ResponseGenerator>;
