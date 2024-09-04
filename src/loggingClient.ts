import { connect } from 'node:http2';
import { readFileSync } from 'node:fs';

// Arguments

const args = process.argv.slice(2);

const portArg = args.find((arg): boolean => arg.startsWith('--port='));
const pathArg = args.find((arg): boolean => arg.startsWith('--path='));
const certArg = args.find((arg): boolean => arg.startsWith('--cert='));
const hostArg = args.find((arg): boolean => arg.startsWith('--host='));

const ERR1 = 'Syntax: loggingClient.ts --host=`host` --port=`port` [--path=`path`] [--cert=`certificate-path`]';
if (!hostArg) {
  throw new Error(ERR1);
}
if (!portArg) {
  throw new Error(ERR1);
}

const host = hostArg.split('=')[1];
const port = Number.parseInt(portArg.split('=')[1], 10);

let path = '/';
if (pathArg) {
  path = pathArg.split('=')[1];
  console.log(`Using path ${path}`);
}

let protocol = 'http';
let options = {};
if (certArg) {
  const cert = readFileSync(certArg.split('=')[1]);
  options = { ca: cert };
  protocol = 'https';
}

// Connecting the client
const client = connect(`${protocol}://${host}:${port}${path}`, options);
client.on('connect', (): void => {
  console.log('succesfully connected');
  client.close();
});
