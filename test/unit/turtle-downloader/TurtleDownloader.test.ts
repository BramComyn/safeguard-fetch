/* eslint-disable jest/prefer-spy-on */
import type { ClientHttp2Stream } from 'node:http2';
import { EventEmitter } from 'node:events';

import { TurtleDownloader } from '../../../src/turtle-downloader/TurtleDownloader';

// Mocking constructor of ``SafeguardRequester`` class
import { SafeguardRequester } from '../../../src/wrapper/SafeguardRequester';

let mockRequester: SafeguardRequester;
let request: jest.Mocked<ClientHttp2Stream>;

jest.mock('../../../src/wrapper/SafeguardRequester', (): any => ({
  SafeguardRequester: jest.fn().mockImplementation((): any => mockRequester),
}));

describe('TurtleDownloader', (): void => {
  let downloader: TurtleDownloader;
  const maxDownloadSize = 1000;

  beforeEach((): void => {
    // This initialization is necessary before initializing the requester
    // because the mockReturnValue would otherwise return ``undefined``
    request = new EventEmitter() as any;
    request.close = jest.fn();
    jest.spyOn(request, 'emit');

    mockRequester = new SafeguardRequester();
    mockRequester.connectAndRequest = jest.fn().mockReturnValue(request);

    downloader = new TurtleDownloader();
  });

  it('should initialize correctly.', (): void => {
    expect(downloader).toBeDefined();
  });

  it('should close a request if the total data size exceeds the maximum.', async(): Promise<void> => {
    request.on = jest.fn().mockImplementation((event: string, callback: any): any => {
      if (event === 'data') {
        return callback(Buffer.alloc(10 * maxDownloadSize, 'a'));
      }

      if (event === 'close') {
        return callback();
      }
    });

    await expect(
      downloader.download(maxDownloadSize, { authority: 'http://example.org' }),
    ).resolves.toBeDefined();

    expect(request.close).toHaveBeenCalledTimes(1);
  });

  it('should return the correct amount of data when the download is successful.', async(): Promise<void> => {
    request.on = jest.fn().mockImplementation((event: string, callback: any): any => {
      if (event === 'data') {
        return callback(Buffer.alloc(maxDownloadSize, 'a'));
      }

      if (event === 'close') {
        return callback();
      }
    });

    await expect(
      downloader.download(maxDownloadSize, { authority: 'http://example.org' }),
    ).resolves.toHaveLength(maxDownloadSize);
  });

  it('should throw an error when the response is not successful.', async(): Promise<void> => {
    request.on = jest.fn().mockImplementation((event: string, callback: any): any => {
      const headers = { ':status': 400 };
      if (event === 'response') {
        return callback(request, headers);
      }

      if (event === 'error') {
        return callback(new Error('Response is not as expected'));
      }
    });

    await expect(
      downloader.download(maxDownloadSize, { authority: 'http://example.org' }),
    ).rejects.toThrow('Response is not as expected');
  });

  it('should throw an error when the content type is not `text/turtle`.', async(): Promise<void> => {
    request.on = jest.fn().mockImplementation((event: string, callback: any): any => {
      const headers = { ':status': 200, 'content-type': 'text/plain' };
      if (event === 'response') {
        return callback(request, headers);
      }

      if (event === 'error') {
        return callback(new Error('Response is not as expected'));
      }
    });

    await expect(
      downloader.download(maxDownloadSize, { authority: 'http://example.org' }),
    ).rejects.toThrow('Response is not as expected');
  });

  it('should throw an error when the content length exceeds the maximum.', async(): Promise<void> => {
    request.on = jest.fn().mockImplementation((event: string, callback: any): any => {
      const headers = { ':status': 200, 'content-type': 'text/turtle', 'content-length': maxDownloadSize + 1 };
      if (event === 'response') {
        return callback(request, headers);
      }

      if (event === 'error') {
        return callback(new Error('Response is not as expected'));
      }
    });

    await expect(
      downloader.download(maxDownloadSize, { authority: 'http://example.org' }),
    ).rejects.toThrow('Response is not as expected');
  });

  it('should throw an error if the download fails.', async(): Promise<void> => {
    request.on = jest.fn().mockImplementation((event: string, callback: any): any => {
      if (event === 'error') {
        return callback(new Error('Download failed'));
      }
    });

    await expect(
      downloader.download(maxDownloadSize, { authority: 'http://example.org' }),
    ).rejects.toThrow('Download failed');
  });

  it('should not throw an error when the content length is not set.', async(): Promise<void> => {
    request.on = jest.fn().mockImplementation((event: string, callback: any): any => {
      const headers = { ':status': 200, 'content-type': 'text/turtle' };
      if (event === 'response') {
        return callback(request, headers);
      }

      if (event === 'close') {
        return callback();
      }
    });

    await expect(
      downloader.download(maxDownloadSize, { authority: 'http://example.org' }),
    ).resolves.toBeDefined();
  });
});
