import type { ClientHttp2Stream, IncomingHttpHeaders } from 'node:http2';
import type { DataEventHandler, ResponseEventHandler } from '../handler/RequestEventHandler';
import type { SafeguardRequester } from '../wrapper/SafeguardRequester';
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
  // We have to work with this type, as it provides a few methods
  // the `Buffer` type does not provide or has deprecated.
  private _buffer: Uint8Array;

  public constructor(private _maxDownloadSize: number, private readonly requester: SafeguardRequester) {
    this.downloadedSize = 0;
    this._buffer = Buffer.alloc(this._maxDownloadSize);

    this.requester.addRequestEventHandler('response', this.handleResponse);
    this.requester.addRequestEventHandler('data', this.handleData);
  }

  /**
   * Returns the buffer.
   * Important: if the class is performing a download, the buffer might not be correctly filled yet.
   * That is why a copy of the buffer is returned.
   */
  public get buffer(): Uint8Array {
    // We have to slice to prevent the buffer from returning an invalid buffer.
    return Uint8Array.from(this._buffer.slice(0, this.downloadedSize));
  }

  /**
   * Returns the maximum download size.
   */
  public get maxDownloadSize(): number {
    return this._maxDownloadSize;
  }

  /**
   * Sets the maximum download size.
   * Important: do not call this method while a download is in progress.
   */
  public set maxDownloadSize(size: number) {
    this._maxDownloadSize = size;
    this._buffer = Buffer.alloc(this._maxDownloadSize);
  }

  /**
   * Handles the `data` event of an HTTP request sent by this downloader.
   * Will close the request if the downloaded size will exceed the set maximum.
   * Will store the downloaded data in the buffer if the size is below the maximum.
   *
   * @param request - The HTTP request.
   * @param data - The data of the HTTP request.
   */
  protected readonly handleData: DataEventHandler =
    (request: ClientHttp2Stream, data: Buffer): void => {
      if (this.downloadedSize + data.length > this._maxDownloadSize) {
        request.close();
      } else {
        data.copy(this._buffer, this.downloadedSize);
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
  protected readonly handleResponse: ResponseEventHandler =
    (request: ClientHttp2Stream, headers: IncomingHttpHeaders): void => {
      if (
        !isSuccessful(getStatusCode(headers)) ||
        headers['content-type'] !== 'text/turtle' ||
        (headers['content-length'] && Number.parseInt(headers['content-length'], 10) > this._maxDownloadSize)
      ) {
        request.close();
      }
    };

  /**
   * Resets the downloaded size and the buffer.
   */
  private reset(): void {
    this.downloadedSize = 0;
    this._buffer = Buffer.alloc(this._maxDownloadSize);
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
    return new Promise<Uint8Array>((resolve, reject): void => {
      request.on('close', (): void => resolve(this._buffer.slice(0, this.downloadedSize)));
      request.on('error', reject);
    });
  }
}
