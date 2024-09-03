import type { ClientHttp2Session, ClientHttp2Stream } from 'node:http2';
import { connect } from 'node:http2';
import { readFileSync } from 'node:fs';
import { HTTPS_PORT } from './infiniteServerConstants';

const client: ClientHttp2Session = connect(`https://localhost:${HTTPS_PORT}`, {
  ca: readFileSync('localhost-cert.pem'),
});

// eslint-disable-next-line ts/naming-convention
const req: ClientHttp2Stream = client.request({ ':path': '/infinite' });

req.on('response', (headers): void => {
  // eslint-disable-next-line no-console
  console.log('Response headers:', headers);
});

req.on('data', (chunk: Buffer): void => {
  // eslint-disable-next-line no-console
  console.log('Received data:', chunk.toString());
});

req.on('end', (): void => {
  client.close();
});
