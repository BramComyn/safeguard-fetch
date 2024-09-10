import type { ClientHttp2Session, ClientHttp2Stream, Http2SecureServer, OutgoingHttpHeaders } from 'node:http2';
import { connect } from 'node:http2';

import {
  ContentLengthAttackServerHttp2Initialiser,
} from '../../../src/attack-server/attack-server-initialiser/ContentLengthAttackServerHttp2Initialiser';
import {
  AttackServerHttp2SecureFactory,
} from '../../../src/attack-server/attack-server-factory/AttackServerHttp2SecureFactory';

import { AttackServer } from '../../../src/attack-server/attack-server/AttackServer';
import { getPort, secureServerOptions } from '../../../src/util';
import { setContentLengthHandler, setNoContentLengthHandler } from '../../../src/wrapper/contentLength';

const TEST_NAME = 'contentLengthUnit';
const port = getPort(TEST_NAME);

describe('contentLength', (): void => {
  let client: ClientHttp2Session;
  let server: AttackServer<Http2SecureServer>;

  let headers: OutgoingHttpHeaders;
  let request: ClientHttp2Stream;

  beforeAll((): void => {
    const factory = new AttackServerHttp2SecureFactory();
    const initialiser = new ContentLengthAttackServerHttp2Initialiser();

    server = new AttackServer<Http2SecureServer>(port, factory, initialiser, secureServerOptions);
    server.start();
  });

  beforeEach((): void => {
    client = connect(`https://localhost:${port}`, { ca: secureServerOptions.cert });
  });

  afterEach((): void => {
    request.close();
    client.close();
  });

  afterAll((): void => {
    server.stop();
  });

  describe('setContentLengthHandler', (): void => {
    let contentLengthHandler: jest.Mock;
    beforeEach((): void => {
      contentLengthHandler = jest.fn();
    });

    it('should call contentLengthHandler upon content length.', async(): Promise<void> => {
      headers = { ':path': '/no-difference' };
      request = client.request(headers);

      await setContentLengthHandler(request, contentLengthHandler);
      expect(contentLengthHandler).toHaveBeenCalledTimes(1);
    });

    it('should not call contentLengthHandler upon lack of content length.', async(): Promise<void> => {
      headers = { ':path': '/no-content-length-finite' };
      request = client.request(headers);

      await setContentLengthHandler(request, contentLengthHandler);
      expect(contentLengthHandler).not.toHaveBeenCalled();
    });
  });

  describe('setNoContentLengthHandler', (): void => {
    let noContentLengthHandler: jest.Mock;
    beforeEach((): void => {
      noContentLengthHandler = jest.fn();
    });

    it('should call noContentLengthHandler upon lack of content length.', async(): Promise<void> => {
      headers = { ':path': '/no-content-length-finite' };
      request = client.request(headers);

      await setNoContentLengthHandler(request, noContentLengthHandler);
      expect(noContentLengthHandler).toHaveBeenCalledTimes(1);
    });

    it('should not call noContentLengthHandler upon content length.', async(): Promise<void> => {
      headers = { ':path': '/no-difference' };
      request = client.request(headers);

      await setNoContentLengthHandler(request, noContentLengthHandler);
      expect(noContentLengthHandler).not.toHaveBeenCalled();
    });
  });
});
