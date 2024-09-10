import type { OutgoingHttpHeaders } from 'node:http';
import { Readable } from 'node:stream';

import { STDHTTP1MSSG, STDHTTP2MSSG } from '../attack-server/attackServerConstants';
import type { ResponseGenerator } from './ResponseGenerator';

/**
 * A generator class that will offer a standard, non-malformed response
 *
 * @member message - the message to be sent in the response
 * @method generateResponse - generates a response with the specified message
 */
export class StandardResponseGenerator implements ResponseGenerator {
  private readonly message: string;

  public constructor(message: string) {
    this.message = message;
  }

  public generateResponse(): {
    headers: OutgoingHttpHeaders;
    body: Readable;
  } {
    return {
      headers: {
        'content-type': 'text/plain',
        'content-length': this.message.length,
      },
      body: Readable.from(this.message),
    };
  }
}

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
