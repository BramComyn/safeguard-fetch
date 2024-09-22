import type {
  ClientHttp2Session,
  ClientHttp2Stream,
  ClientSessionOptions,
  ClientSessionRequestOptions,
  IncomingHttpHeaders,
  OutgoingHttpHeaders,
  SecureClientSessionOptions,
} from 'node:http2';

import type { Socket } from 'node:net';
import type { TLSSocket } from 'node:tls';

import type { ResponseEventHandler } from '../handler/RequestEventHandler';
import { SafeguardRequester } from '../wrapper/SafeguardRequester';
import { getStatusCode, isSuccessful } from '../util';

/**
 * A class to download Turtle data from a given URL.
 * This class has some simplifications and thus limitations:
 * - It only supports the `text/turtle` content type.
 * - It only supports successful requests.
 * - It doesn't validate the Turtle data, it just checks the `content-type` header.
 *
 * @member downloadedSize The size of the downloaded data.
 * @member requester The requester to send HTTP requests.
 * @member maxDownloadSize The maximum size of the downloaded data.
 * @member buffer The buffer to store the downloaded data.
 * @method handleResponse Handles the response event of the HTTP request.
 */
export class TurtleDownloader {
  /**
   * Creates a handler for the `response` event of an HTTP request sent by this downloader.
   * Will close the request if the response is not successful, the content type is not `text/turtle`,
   * or the content length exceeds the set maximum.
   * 
   * @param maxDownloadSize - The maximum size of the downloaded data.
   * 
   * @returns The handler for the `response` event, which is of the type `ResponseEventHandler`.
   */
  protected createResponseHandler(maxDownloadSize: number): ResponseEventHandler {
    return (request: ClientHttp2Stream, headers: IncomingHttpHeaders): void => {
      if (
        !isSuccessful(getStatusCode(headers)) ||
        headers['content-type'] !== 'text/turtle' ||
        (headers['content-length'] && Number.parseInt(headers['content-length'], 10) > maxDownloadSize)
      ) {
        request.emit('error', new Error('Response is not as expected.'));
      }
    };
  }

  /**
   * Downloads a maximum of `maxDownloadSize` bytes from the given url
   * 
   * @param maxDownloadSize - The maximum size of the downloaded data.
   * @param configuration - The configuration for the download.
   * 
   * @returns The downloaded data as a `Uint8Array`.
   */
  public async download(
    maxDownloadSize: number,
    configuration: {
      authority: string | URL;
      sessionOptions?: ClientSessionOptions | SecureClientSessionOptions;
      listener?: (session: ClientHttp2Session, socket: Socket | TLSSocket) => void;
      requestHeaders?: OutgoingHttpHeaders;
      requestOptions?: ClientSessionRequestOptions;
    }
  ): Promise<Uint8Array> {
    const requester = new SafeguardRequester(
      {},
      { response: [ this.createResponseHandler(maxDownloadSize) ] },
    );

    const buffer = new Uint8Array(maxDownloadSize);
    const request = requester.connectAndRequest(configuration);

    let downloadedSize = 0;

    // We have to set the 'data' even handler here, because I found no other way to
    // access the buffer and the downloaded size from within the handler, as numbers
    // are passed by value in TypeScript :(

    request.on('data', (data: Buffer): void => {
      if (downloadedSize + data.length > maxDownloadSize) {
        data.copy(buffer, downloadedSize, 0, maxDownloadSize - downloadedSize);
        downloadedSize = maxDownloadSize;

        // Gracefully closing the request and session will not work, thus we pull
        // out the big guns and forcefully close the request and session.
        request.session?.destroy();
        request.close();
      } else {
        data.copy(buffer, downloadedSize);
        downloadedSize += data.length;
      }
    });

    // We want to await the end or error of the request,
    // so that we can be sure the entire buffer is filled and returned.
    return new Promise<Uint8Array>((resolve, reject): void => {
      request.on('close', (): void => {
        request.session?.close();
        resolve(buffer.slice(0, downloadedSize));
      });

      request.on('error', (): void => reject(new Error('Error during download.')));
    });
  }
}
