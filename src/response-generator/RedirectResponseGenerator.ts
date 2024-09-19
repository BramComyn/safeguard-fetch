import type { OutgoingHttpHeaders } from 'node:http2';
import type { Readable } from 'node:stream';

import type { ResponseGenerator } from './ResponseGenerator';

export class RedirectResponseGenerator implements ResponseGenerator {
  public constructor(private readonly status: number, private readonly location: string | URL) {}
  public generateResponse(): {
    headers: OutgoingHttpHeaders;
    body: Readable | undefined;
  } {
    const headers: OutgoingHttpHeaders = {
      ':status': this.status?.toString(),
      location: this.location.toString(),
    };
    return {
      headers,
      body: undefined,
    };
  }
}
