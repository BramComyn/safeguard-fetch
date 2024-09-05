/* eslint-disable ts/naming-convention */
import * as readline from 'node:readline/promises';
import { connect } from 'node:http2';
import { readFileSync } from 'node:fs';

import { fromRoot } from '../util';

// A command line interface for trying Node.js clients with HTTP/2.0 over TLS
export class VictimClient {
  private _host?: string;
  private _port?: number;
  private _path?: string;
  private _cert?: string;

  private aborted = false;

  public constructor(host?: string, port?: number, path?: string, cert?: string) {
    this._host = host;
    this._port = port;
    this._path = path;
    this._cert = cert;
  }

  // Start command line session with the user
  public async startSession(): Promise<void> {
    console.log('Client session started (HTTP/2.0 over TLS)');
    while (!this.aborted) {
      await this.askUserDetails();

      const options = { ca: this._cert };
      const client = connect(`https://${this._host}:${this._port}`, options);

      const req = client.request({ ':path': this._path });
      req.on('response', (headers): void => {
        console.log('Response headers:', headers);
      });

      req.on('data', (chunk: Buffer): void => {
        console.log('\nNew data chunk:\n', chunk.toString());
      });

      this.aborted = await new Promise<boolean>(
        (resolve): void => {
          // eslint-disable-next-line ts/no-misused-promises
          req.on('end', async(): Promise<void> => {
            console.log('No more data in response.');

            // Manually close the connection to avoid a lingering process when the user wants to stop
            client.close();

            resolve(await this.askUserContinue());
          });
        },
      );
    }
  }

  // Ask the user for desired server details
  private async askUserDetails(): Promise<void> {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    try {
      this._host = await rl.question('Enter the host: ');
      this._port = Number.parseInt(await rl.question('Enter the port: '), 10);
      this._path = await rl.question('Enter the path: ');
      const certificatePath = await rl.question('Enter the certificate path: ');
      this._cert = readFileSync(fromRoot(certificatePath)).toString();
    } finally {
      rl.close();
    }
  }

  // Ask the user if they want to continue connecting to servers and sending requests
  // If no, aborted is set to true and the loop stops, ending the cli-session
  private async askUserContinue(): Promise<boolean> {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    try {
      const answer = await rl.question('Do you want to continue? (y/n) ');
      return answer === 'n';
    } finally {
      rl.close();
    }
  }
}
