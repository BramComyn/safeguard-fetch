import type { OutgoingHttpHeaders } from 'node:http';
import type { Readable } from 'node:stream';

/**
 * A generator interface for server responses of different sizes
 *
 * @method generateResponse - generates a response with the specified size
 */
export interface ResponseGenerator {
  /**
   * Generate a response based on what parameters the inheriting class has
   *
   * @returns the headers and body of the response
   */
  generateResponse: () => {
    headers: OutgoingHttpHeaders;
    body: Readable | undefined;
  };
}
