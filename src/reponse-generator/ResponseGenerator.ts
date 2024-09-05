import type { OutgoingHttpHeaders } from 'node:http';
import type { OutgoingHttpHeaders as OutgoingHttp2Headers } from 'node:http2';
import type { Readable } from 'node:stream';

// A generator interface for server responses of different sizes
// actualSize: the actual size of the response
// contentLength: the content length of the response -- used to set the header in the response
export interface ResponseGenerator {
  generateResponse: () => {
    headers: OutgoingHttpHeaders | OutgoingHttp2Headers;
    body: Readable;
  };
  actualSize: number;
  contentLength: number | null;
}
