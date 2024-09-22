import type { OutgoingHttpHeaders } from 'node:http';
import { Readable } from 'node:stream';

import type { ResponseGenerator } from './ResponseGenerator';

/**
 * A generator class that will offer a standard, non-malformed response
 *
 * @member message - the message to be sent in the response
 * @method generateResponse - generates a response with the specified message
 */
export class StandardResponseGenerator implements ResponseGenerator {
  protected readonly message: string;

  public constructor(message: string) {
    this.message = message;
  }

  public generateResponse(): {
    headers: OutgoingHttpHeaders;
    body: Readable;
  } {
    return {
      headers: {
        ':status': 200,
        'content-type': 'text/plain',
        'content-length': this.message.length,
      },
      body: Readable.from(this.message),
    };
  }
}

export const STDHTTP1MSSG = 'Infinite server endpoint (HTTP/1.1)\n';
export const STDHTTP2MSSG = 'Infinite server endpoint (HTTP/2.0)\n';

/**
 * @returns a standard response generator for HTTP/1.1
 */
export function standardHttpResponseGenerator(): StandardResponseGenerator {
  return new StandardResponseGenerator(STDHTTP1MSSG);
}

/**
 * @returns a standard response generator for HTTP/2.0
 */
export function standardHttp2ResponseGenerator(): StandardResponseGenerator {
  return new StandardResponseGenerator(STDHTTP2MSSG);
}
