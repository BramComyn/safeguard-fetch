import type { OutgoingHttpHeaders } from 'node:http2';
import { createReadStream } from 'node:fs';
import type { Readable } from 'node:stream';

import { fromRoot } from '../util';
import type { ResponseGenerator } from './ResponseGenerator';

/**
 * A response generator that returns a JSON-LD response.
 */
export class JsonLdResponseGenerator implements ResponseGenerator {
  public generateResponse(): { headers: OutgoingHttpHeaders; body: Readable } {
    const data = createReadStream(fromRoot('assets/data.jsonld'));
    return {
      headers: {
        ':status': '200',
        'content-type': 'application/ld+json',
      },
      body: data,
    };
  };
}
