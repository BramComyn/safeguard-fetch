import type { ClientHttp2Stream } from 'node:http2';
import type { RequestEventHandler } from '../RequestEventHandler';

/**
 * Interface for custom event handlers that handle `frameError` events for request streams.
 */
export interface RequestFrameErrorHandler
  extends RequestEventHandler<'frameError'> {
  /**
   * Handles the frame error event for a request stream.
   *
   * @param request - The request stream.
   * @param type - The frame type.
   * @param code - The error code.
   * @param id - The stream ID.
   */
  handle: (request: ClientHttp2Stream, type: number, code: number, id: number) => void;
}
