/* eslint-disable ts/naming-convention */
import type { OutgoingHttpHeaders } from 'node:http';
import type { OutgoingHttpHeaders as OutgoingHttp2Headers } from 'node:http2';
import { PassThrough, Readable } from 'node:stream';

import { INTERVAL_TIME } from '../attack-server/attackServerConstants';
import type { ResponseGenerator } from './ResponseGenerator';

// A generator class that will generate malformed responses for attack servers
export class AttackResponseGenerator implements ResponseGenerator {
  private readonly actualSize: number;
  private readonly contentLength: number | null;

  public constructor(actualSize: number, contentLength: number | null) {
    this.actualSize = actualSize;
    this.contentLength = contentLength;
  }

  public generateResponse(): {
    headers: OutgoingHttpHeaders | OutgoingHttp2Headers;
    body: Readable;
  } {
    let stream: Readable;
    if (this.actualSize === Infinity) {
      // Create dummy stream that will push data infinitely
      stream = new PassThrough();
      stream.push('a');

      // Pushing data to the stream every INTERVAL_TIME milliseconds
      // Pushing on every data event will cause a stack overflow
      setInterval((): void => {
        stream.push('a');
      }, INTERVAL_TIME);
    } else {
      stream = Readable.from('a'.repeat(this.actualSize));
    }

    const response: { headers: OutgoingHttpHeaders | OutgoingHttp2Headers; body: Readable } = {
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
