import { request } from 'node:http';

const hostname = 'localhost';
const port = 8080;

// Change path when needed
const path = '/small-difference';

const options = {
  hostname,
  port,
  path,
  method: 'GET',
};

const req = request(options);
req.end();

req.on('response', (res): void => {
  console.log(`statusCode: ${res.statusCode}`);
  res.on('data', (d: string | Uint8Array): void => {
    process.stdout.write(d);
  });
});
