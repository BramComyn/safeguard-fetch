import * as readline from 'node:readline/promises';
import { connect } from 'node:http2';
import { readFileSync } from 'node:fs';

import { fromRoot } from '../util';

/**
 * A command line interface for trying Node.js clients with HTTP/2.0 over TLS
 * 
 * @member host: the host to connect to
 * @member port: the port to connect to
 * @member path: the path to request
 * @member cert: the certificate to use
 * @member aborted: whether the client has been aborted the cycle
 */
export class VictimClient {
  private aborted = false;

  public constructor(
    private host?: string,
    private port?: number,
    private path?: string,
    private cert?: string,
  ) {}

  /**
   * Start command line session with the user
   */
  public async startSession(): Promise<void> {
    console.log('Client session started (HTTP/2.0 over TLS)');
    while (!this.aborted) {
      await this.askUserDetails();

      const options = { ca: this.cert };
      const client = connect(`https://${this.host}:${this.port}`, options);

      const req = client.request({ ':path': this.path });
      req.on('response', (headers): void => {
        console.log('\nNew response headers:\n', headers);
      });

      req.on('data', (chunk: Buffer): void => {
        console.log('\nNew data chunk:\n', chunk.toString());
      });

      this.aborted = await new Promise<boolean>(
        (resolve): void => {
          // eslint-disable-next-line ts/no-misused-promises
          req.on('end', async(): Promise<void> => {
            console.log('\nNo more data in response.');

            // Manually close the connection to avoid a lingering process when the user wants to stop
            client.close();

            resolve(await this.askUserContinue());
          });

          // Prevent the process from crashing when an error occurs
          // eslint-disable-next-line ts/no-misused-promises
          req.on('error', async(err): Promise<void> => {
            console.error('\nAn error occurred:', err);
            client.close();
            resolve(await this.askUserContinue());
          });
        },
      );
    }
  }

  /**
   * Ask the user for desired server details
   */
  private async askUserDetails(): Promise<void> {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    try {
      this.host = await rl.question('Enter the host: ');
      this.port = Number.parseInt(await rl.question('Enter the port: '), 10);
      this.path = await rl.question('Enter the path: ');
      const certificatePath = await rl.question('Enter the certificate path: ');
      this.cert = readFileSync(fromRoot(certificatePath)).toString();
    } finally {
      rl.close();
    }
  }

  /**
   * Ask the user if they want to continue connecting to servers and sending requests
   * If no, aborted is set to true and the loop stops, ending the cli-session
   */
  private async askUserContinue(): Promise<boolean> {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    try {
      const answer = await rl.question('\nDo you want to continue? (y/n) ');
      return answer === 'n';
    } finally {
      rl.close();
    }
  }
}
