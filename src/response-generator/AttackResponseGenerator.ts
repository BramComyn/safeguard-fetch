/* eslint-disable ts/naming-convention */
import type { OutgoingHttpHeaders } from 'node:http';
import { Readable } from 'node:stream';

import type { ResponseGenerator } from './ResponseGenerator';

/**
 * A generator class that will generate malformed responses for attack servers
 */
export class AttackResponseGenerator implements ResponseGenerator {
  private readonly actualSize: number;
  private readonly contentLength: number | null;

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
