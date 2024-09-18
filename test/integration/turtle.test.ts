import type { Http2SecureServer } from 'node:http2';

import { AttackServer } from '../../src/attack-server/attack-server/AttackServer';
import { TurtleDownloader } from '../../src/turtle-downloader/TurtleDownloader';
import { SafeguardRequester } from '../../src/wrapper/SafeguardRequester';
import { getPort, secureServerOptions } from '../../src/util';

import {
  AttackServerHttp2SecureFactory,
} from '../../src/attack-server/attack-server-factory/AttackServerHttp2SecureFactory';

import {
  TurtleAttackServerHttp2Initializer,
} from '../../src/attack-server/attack-server-initializer/TurtleAttackServerHttp2Initializer';

const TEST_NAME = 'TurtleIntegration';
const port = getPort(TEST_NAME);

/**
 * This test is meant as a showcase of the possible mitigation
 * as explained in: https://rubensworks.github.io/article-ldtraversal-security/
 * (Exploit: producing infinite RDF documents)
 */
describe('TurtleDownloader', (): void => {
  const maxDownloadSize = 1_000_000;
  const requester = new SafeguardRequester();
  const downloader = new TurtleDownloader(maxDownloadSize, requester);

  const factory = new AttackServerHttp2SecureFactory();
  const initializers = [
    new TurtleAttackServerHttp2Initializer(),
  ];

  const server = new AttackServer<Http2SecureServer>(
    port,
    factory,
    initializers,
    secureServerOptions,
  );

  server.start();

  afterAll(async(): Promise<void> => {
    server.stop();
  });

  it('should limit the downloading of turtle data.', async(): Promise<void> => {
    const url = new URL(`https://localhost:${port}`);

    await expect(
      downloader.download({
        authority: url,
        sessionOptions: { ca: secureServerOptions.cert },
        requestHeaders: {
          ':path': '/turtle',
        },
      }),
    ).resolves.toHaveLength(maxDownloadSize);
  });
});
