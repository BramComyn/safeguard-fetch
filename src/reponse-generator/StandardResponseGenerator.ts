/* eslint-disable ts/naming-convention */
import type { OutgoingHttpHeaders } from 'node:http';
import type { OutgoingHttpHeaders as OutgoingHttp2Headers } from 'node:http2';
import { Readable } from 'node:stream';

import { STDHTTP1MSSG, STDHTTP2MSSG } from '../attack-server/attackServerConstants';
import type { ResponseGenerator } from './ResponseGenerator';

// A generator class that will offer a standard, non-malformed response
class StandardResponseGenerator implements ResponseGenerator {
  public actualSize: number;
  public contentLength: number;
  public message: string;

  public constructor(message: string) {
    this.message = message;
    this.actualSize = message.length;
    this.contentLength = message.length;
  }

  public generateResponse(): {
    headers: OutgoingHttpHeaders | OutgoingHttp2Headers;
    body: Readable;
  } {
    return {
      headers: {
        'content-type': 'text/plain',
        'content-length': this.contentLength,
      },
      body: Readable.from(this.message),
    };
  }
}

export function standardHttpResponseGenerator(): StandardResponseGenerator {
  return new StandardResponseGenerator(STDHTTP1MSSG);
}

export function standardHttp2ResponseGenerator(): StandardResponseGenerator {
  return new StandardResponseGenerator(STDHTTP2MSSG);
}
