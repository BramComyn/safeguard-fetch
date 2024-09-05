/* eslint-disable ts/naming-convention */
import type { OutgoingHttpHeaders } from 'node:http';
import type { OutgoingHttpHeaders as OutgoingHttp2Headers } from 'node:http2';
import { Readable } from 'node:stream';

import { CONTENT_LENGTH } from '../attack-server/attackServerConstants';
import type { ResponseGenerator } from './ResponseGenerator';

// A generator class that will generate malformed responses for attack servers
class AttackResponseGenerator implements ResponseGenerator {
  public actualSize;
  public contentLength;

  public constructor(actualSize: number, contentLength: number | null) {
    this.actualSize = actualSize;
    this.contentLength = contentLength;
  }

  public generateResponse(): {
    headers: OutgoingHttpHeaders | OutgoingHttp2Headers;
    body: Readable;
  } {
    return {
      headers: {
        'content-type': 'text/plain',
        'content-length': this.contentLength ?? CONTENT_LENGTH,
      },
      body: Readable.from('a'.repeat(this.actualSize)),
    };
  }
}

// A factory function to create an attack response generator
export function attackResponseGenerator(actualSize: number, contentLength: number | null): AttackResponseGenerator {
  return new AttackResponseGenerator(actualSize, contentLength);
}
