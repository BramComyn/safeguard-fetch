const http = require('node:http');
const { INTERVAL_TIME, HTTP1MSSG, HTTP_PORT } = require('./infinite-server-constants');

const server = http.createServer((req, res) => {
  res.writeHead(200, {
    'Content-Type': 'text/plain',
    // ! Stream will abort once DATA size is larger than the Content-Length header (if specified)
    // ! Ommiting the content-length header will allow the stream to be infinite
    // ? Not found anything in the specs about having to close the stream, yet.
    // * TD: figure out if this is Node.js specific or HTTP/1.1 specific
    // 'Content-Length': cons.CONTENT_LENGTH
  });

  if (req.url === '/infinite') {
    // Infinite response cycle
    const interval = setInterval(() => {
      res.write(`${req.url.slice(1)}\n`);
    }, INTERVAL_TIME);

    req.on('close', () => {
      clearInterval(interval);
      res.end();
    });

    return;
  }

  res.write(HTTP1MSSG);
  res.end();
});

server.listen(HTTP_PORT);
