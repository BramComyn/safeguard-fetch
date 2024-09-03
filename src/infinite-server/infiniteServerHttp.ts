import type { Server } from 'node:http';
import { createServer } from 'node:http';

import {
  CONTENT_LENGTH,
  HTTP1MSSG,
  HTTP_PORT,
  INTERVAL_TIME,
} from './infiniteServerConstants';

const server: Server = createServer((req, res): void => {
  res.writeHead(200, {
    /* eslint-disable-next-line ts/naming-convention */
    'content-type': 'text/plain',
    // ! Stream will abort once DATA size is larger than the Content-Length header (if specified)
    // ! Ommiting the content-length header will allow the stream to be infinite
    // ? Not found anything in the specs about having to close the stream, yet.
    // * TD: figure out if this is Node.js specific or HTTP/1.1 specific
    /* eslint-disable-next-line ts/naming-convention */
    'content-length': CONTENT_LENGTH,
  });

  if (req.url !== undefined && req.url === '/infinite') {
    // Infinite response cycle
    const interval = setInterval((): void => {
      res.write(`${req.url!.slice(1)}\n`);
    }, INTERVAL_TIME);

    req.on('close', (): void => {
      clearInterval(interval);
      res.end();
    });

    return;
  }

  res.write(HTTP1MSSG);
  res.end();
});

server.listen(HTTP_PORT);
