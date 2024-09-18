/* eslint-disable jest/prefer-spy-on */
import { EventEmitter } from 'node:events';
import type { ClientHttp2Stream } from 'node:http2';

import { TurtleDownloader } from '../../../src/turtle-downloader/TurtleDownloader';
import type { SafeguardRequester } from '../../../src/wrapper/SafeguardRequester';
import type { RequestEventHandler } from '../../../src/handler/RequestEventHandler';

describe('TurtleDownloader', (): void => {
  let downloader: TurtleDownloader;
  let request: jest.Mocked<ClientHttp2Stream>;
  let requester: jest.Mocked<SafeguardRequester>;
  let handleData: RequestEventHandler<'data'>;
  let handleResponse: RequestEventHandler<'response'>;

  beforeEach((): void => {
    request = new EventEmitter() as any;
    request.close = jest.fn();

    requester = {
      addRequestEventHandler: jest.fn(),
      connectAndRequest: jest.fn().mockReturnValue(request),
    } as any;

    downloader = new TurtleDownloader(100, requester);

    handleResponse = requester.addRequestEventHandler.mock.calls[0][1] as RequestEventHandler<'response'>;
    handleData = requester.addRequestEventHandler.mock.calls[1][1] as RequestEventHandler<'data'>;
  });

  it('should initialize correctly.', (): void => {
    expect(downloader).toBeDefined();
    expect(requester.addRequestEventHandler).toHaveBeenCalledTimes(2);
  });

  it('should close a request if the total data size exceeds the maximum download size.', (): void => {
    const data = Buffer.alloc(1000);
    data.fill('a');

    handleData(request, data);
    expect(request.close).toHaveBeenCalledTimes(1);
  });

  it('should copy the data to the buffer if the total data size is below the maximum.', (): void => {
    const data = Buffer.alloc(10);
    data.fill('a');

    handleData(request, data);
    expect(request.close).not.toHaveBeenCalled();
    expect(downloader.buffer).toEqual(Uint8Array.from(data));
  });

  it('should close the request if the statuscode is not in the `2xx successful` range.', (): void => {
    const headers = {
      ':status': '400',
    };

    handleResponse(request, headers);
    expect(request.close).toHaveBeenCalledTimes(1);
  });

  it('should close the request if the content type is not `text/turtle`.', (): void => {
    const headers = {
      ':status': '200',
      'content-type': 'text/plain',
    };

    handleResponse(request, headers);
    expect(request.close).toHaveBeenCalledTimes(1);
  });

  it(
    'should close the request if the `content-length` header is defined to be larger than the maximum size.',
    (): void => {
      const headers = {
        ':status': '200',
        'content-type': 'text/turtle',
        'content-length': '200',
      };

      handleResponse(request, headers);
      expect(request.close).toHaveBeenCalledTimes(1);
    },
  );

  it('should not close the request if the `content-length` header is not provided.', (): void => {
    const headers = {
      ':status': '200',
      'content-type': 'text/turtle',
    };

    handleResponse(request, headers);
    expect(request.close).not.toHaveBeenCalled();
  });

  it('should set the maximum download size.', (): void => {
    expect(downloader.maxDownloadSize).toBe(100);
    downloader.maxDownloadSize = 200;
    expect(downloader.maxDownloadSize).toBe(200);
  });

  it.only('should correctly download the given turtle file.', async(): Promise<void> => {
    const url = new URL('http://example.com');
    const data = Buffer.alloc(10);
    data.fill('a');

    handleData(request, data);
    handleResponse(request, {
      ':status': '200',
      'content-type': 'text/turtle',
      'content-length': '10',
    });

    await expect(
      downloader.download(url),
    ).resolves.toEqual(Uint8Array.from(data));
    request.emit('close');
  });

  it.skip('should throw an error if the download fails.', async(): Promise<void> => {
    const url = new URL('http://example.com');
    await expect(
      downloader.download(url),
    ).rejects.toThrow(Error);
  });
});
