import type { OutgoingHttpHeaders } from 'node:http2';
import { Readable } from 'node:stream';
import { readFileSync } from 'node:fs';

import { fromRoot } from '../util';
import type { ResponseGenerator } from './ResponseGenerator';

export class TurtleResponseGenerator implements ResponseGenerator {
  public generateResponse(): { headers: OutgoingHttpHeaders; body: Readable } {
    const data = readFileSync(fromRoot('assets/example-data.ttl'));

    const stream = new Readable({
      read: (): boolean => stream.push(data),
    });

    return {
      headers: {
        ':status': '200',
        'content-type': 'text/turtle',
      },
      body: stream,
    };
  }
}
