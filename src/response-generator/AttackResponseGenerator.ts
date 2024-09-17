import type { OutgoingHttpHeaders } from 'node:http';
import { Readable } from 'node:stream';

import type { ResponseGenerator } from './ResponseGenerator';

/**
 * A generator class that will generate malformed responses for attack servers
 *
 * @member actualSize - the actual size of the response
 * @member contentLength - the content length advertised in the response
 * @method generateResponse - generates a response with the specified size and content length
 */
export class AttackResponseGenerator implements ResponseGenerator {
  protected readonly actualSize: number;
  protected readonly contentLength: number | null;

  public constructor(actualSize: number, contentLength: number | null) {
    this.actualSize = actualSize;
    this.contentLength = contentLength;
  }

  public generateResponse(): {
    headers: OutgoingHttpHeaders;
    body: Readable;
  } {
    let stream: Readable;
    if (Number.isFinite(this.actualSize)) {
      stream = Readable.from('a'.repeat(this.actualSize));
    } else {
      // Create dummy stream that will push data infinitely
      stream = new Readable({
        read: (): boolean => stream.push('a'),
      });
    }

    const response: { headers: OutgoingHttpHeaders; body: Readable } = {
      headers: {
        ':status': '200',
        'content-type': 'text/plain',
      },
      body: stream,
    };

    if (this.contentLength !== null) {
      response.headers = { ...response.headers, 'content-length': this.contentLength };
    }

    return response;
  }
}
