const http2 = require('node:http2');
const fs = require('node:fs');
const { INTERVAL_TIME, HTTP2MSSG, HTTPS_PORT } = require('./infinite-server-constants');

/* eslint no-sync: ["error", { allowAtRootLevel: true }] */
const server = http2.createSecureServer({
  key: fs.readFileSync('localhost-privkey.pem'),
  cert: fs.readFileSync('localhost-cert.pem'),
});
/// server.on('error', err => console.error(err));

server.on('stream', (stream, headers) => {
  const path = headers[':path'];

  if (path === '/infinite') {
    stream.respond({
      'content-type': 'text/plain',
      ':status': 200,
      // ! Stream will abort once DATA size is larger than the Content-Length header (if specified)
      // ! Ommiting the content-length header will allow the stream to be infinite
      // * See also https://datatracker.ietf.org/doc/html/rfc9113#name-malformed-messages
      // * TD: figure out if this is Node.js specific or HTTP/2 specific
      // 'content-length': cons.CONTENT_LENGTH
    });

    // Infinite response cycle
    const interval = setInterval(() => {
      stream.write(`${path.slice(1)}\n`);
    }, INTERVAL_TIME);

    stream.on('close', () => {
      clearInterval(interval);
      stream.end();
    });

    return;
  }

  stream.respond({
    'content-type': 'text/html',
    ':status': 200,
  });

  stream.end(HTTP2MSSG);
});

server.listen(HTTPS_PORT);
