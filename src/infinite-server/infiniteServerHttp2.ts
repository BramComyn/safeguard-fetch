import type { Http2SecureServer, ServerHttp2Stream } from 'node:http2';
import { createSecureServer } from 'node:http2';
import { readFileSync } from 'node:fs';

import {
  CONTENT_LENGTH,
  HTTP2MSSG,
  HTTPS_PORT,
  INTERVAL_TIME,
} from './infiniteServerConstants';

/* eslint no-sync: ["error", { allowAtRootLevel: true }] */
const options = {
  key: readFileSync('../../assets/localhost-privkey.pem'),
  cert: readFileSync('../../assets/localhost-cert.pem'),
};

const server: Http2SecureServer = createSecureServer(options);
server.on('stream', (stream: ServerHttp2Stream, headers): void => {
  const path = headers[':path'];

  if (path === '/infinite') {
    stream.respond({
      // eslint-disable-next-line ts/naming-convention
      'content-type': 'text/plain',
      // eslint-disable-next-line ts/naming-convention
      ':status': 200,
      // ! Stream will abort once DATA size is larger than the Content-Length header (if specified)
      // ! Ommiting the content-length header will allow the stream to be infinite
      // * See also https://datatracker.ietf.org/doc/html/rfc9113#name-malformed-messages
      // * TD: figure out if this is Node.js specific or HTTP/2 specific
      // Setting this header allows for checking whether all browser clients stop reading data
      // eslint-disable-next-line ts/naming-convention
      'content-length': CONTENT_LENGTH,
    });

    // Infinite response cycle
    const interval = setInterval((): void => {
      stream.write(`${path.slice(1)}\n`);
    }, INTERVAL_TIME);

    stream.on('close', (): void => {
      clearInterval(interval);
      stream.end();
    });

    return;
  }

  stream.respond({
    // eslint-disable-next-line ts/naming-convention
    ':status': 200,
  });

  stream.end(HTTP2MSSG);
});

server.listen(HTTPS_PORT);
console.log(`Server listening on https://localhost:${HTTPS_PORT}`);
