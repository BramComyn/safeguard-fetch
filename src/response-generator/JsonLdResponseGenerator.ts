import type { OutgoingHttpHeaders } from 'node:http2';
import { readFileSync } from 'node:fs';
import { Readable } from 'node:stream';

import { fromRoot } from '../util';
import type { ResponseGenerator } from './ResponseGenerator';

/**
 * A response generator that returns an infinite JSON-LD response.
 */
export class JsonLdResponseGenerator implements ResponseGenerator {
  public generateResponse(): { headers: OutgoingHttpHeaders; body: Readable } {
    const data = readFileSync(fromRoot('assets/data.jsonld'));

    const stream = new Readable({
      read: (): boolean => stream.push(data),
    });

    return {
      headers: {
        ':status': '200',
        'content-type': 'application/ld+json',
      },
      body: stream,
    };
  };
}
