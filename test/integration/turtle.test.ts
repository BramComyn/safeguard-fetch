import type { Http2SecureServer } from 'node:http2';

import type { ResponseGeneratorMap } from '../../src/attack-server/attack-server-initializer/AttackServerInitializer';
import { HTTP2_SERVER_PATHS, TURTLE_PATHS } from '../../src/attack-server/attackServerConstants';
import { AttackServer } from '../../src/attack-server/attack-server/AttackServer';
import { TurtleDownloader } from '../../src/turtle-downloader/TurtleDownloader';
import { getPort, secureServerOptions } from '../../src/util';

import {
  AttackServerHttp2SecureFactory,
} from '../../src/attack-server/attack-server-factory/AttackServerHttp2SecureFactory';

import {
  AttackServerHttp2Initializer,
} from '../../src/attack-server/attack-server-initializer/AttackServerHttp2Initializer';

const paths: ResponseGeneratorMap = { ...HTTP2_SERVER_PATHS, ...TURTLE_PATHS };

const TEST_NAME = 'TurtleIntegration';
const port = getPort(TEST_NAME);

/**
 * This test is meant as a showcase of the possible mitigation
 * as explained in: https://rubensworks.github.io/article-ldtraversal-security/
 * (Exploit: producing infinite RDF documents)
 */
describe('TurtleDownloader', (): void => {
  const maxDownloadSize = 1_000_000;
  const downloader = new TurtleDownloader();

  const factory = new AttackServerHttp2SecureFactory();
  const initializers = [
    new AttackServerHttp2Initializer(paths),
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
      downloader.download(
        maxDownloadSize,
        {
          authority: url,
          sessionOptions: { ca: secureServerOptions.cert },
          requestHeaders: {
            ':path': '/turtle',
          },
        },
      ),
    ).resolves.toHaveLength(maxDownloadSize);
  });
});
