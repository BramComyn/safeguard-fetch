import type { ClientHttp2Stream, IncomingHttpHeaders } from 'node:http2';
import type { DataEventHandler, ResponseEventHandler } from '../handler/RequestEventHandler';
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
 * @method handleData Handles the data event of the HTTP request.
 * @method handleResponse Handles the response event of the HTTP request.
 */
export class TurtleDownloader {
  private downloadedSize: number;
  private readonly requester: SafeguardRequester;
  // We have to work with this type, as it provides a few methods
  // the `Buffer` type does not provide or has deprecated.
  private buffer: Uint8Array;

  public constructor(private maxDownloadSize: number) {
    this.downloadedSize = 0;
    this.buffer = Buffer.alloc(this.maxDownloadSize);

    const handlerMap = {
      response: [ this.handleResponse ],
      data: [ this.handleData ],
    };

    this.requester = new SafeguardRequester({}, handlerMap);
  }

  /**
   * Handles the `data` event of an HTTP request sent by this downloader.
   * Will close the request if the downloaded size will exceed the set maximum.
   * Will store the downloaded data in the buffer if the size is below the maximum.
   *
   * @param request - The HTTP request.
   * @param data - The data of the HTTP request.
   */
  private readonly handleData: DataEventHandler =
    (request: ClientHttp2Stream, data: Buffer): void => {
      if (this.downloadedSize + data.length > this.maxDownloadSize) {
        request.close();
      } else {
        data.copy(this.buffer, this.downloadedSize);
        this.downloadedSize += data.length;
      }
    };

  /**
   * Handles the `response` event of an HTTP request sent by this downloader.
   * Will close the request if the request is not successful,
   * if the content type is not `text/turtle`, or if the content length
   * header is set to a value larger than the maximum download size.
   *
   * @param request - The HTTP request.
   * @param headers - The incoming headers of the new response
   */
  private readonly handleResponse: ResponseEventHandler =
    (request: ClientHttp2Stream, headers: IncomingHttpHeaders): void => {
      if (
        !isSuccessful(getStatusCode(headers)) ||
        headers['content-type'] !== 'text/turtle' ||
        (headers['content-length'] && Number.parseInt(headers['content-length'], 10) > this.maxDownloadSize)
      ) {
        request.close();
      }
    };

  /**
   * Sets the maximum size of the downloaded data.
   *
   * @param size - The maximum size of the downloaded data.
   */
  public setMaxDownloadSize(size: number): void {
    this.maxDownloadSize = size;
  }

  /**
   * Resets the downloaded size and the buffer.
   */
  private reset(): void {
    this.downloadedSize = 0;
    this.buffer = Buffer.alloc(this.maxDownloadSize);
  }

  /**
   * Downloads the data from the given URL and returns the data as a Buffer.
   *
   * @param url - The URL to download the data from.
   *
   * @returns The downloaded data as a Buffer.
   */
  public async download(url: URL): Promise<Uint8Array> {
    this.reset();

    const request = this.requester.connectAndRequest({
      authority: url.host,
      sessionOptions: {},
      listener: undefined,
      requestHeaders: {
        ':path': url.pathname,
      },
      requestOptions: {},
    });

    // We want to await the end or error of the request,
    // so that we can be sure the entire buffer is filled and returned.
    await new Promise<void>((resolve, reject): void => {
      request.on('close', resolve);
      request.on('error', reject);
    });

    return this.buffer.slice(0, this.downloadedSize);
  }
}
