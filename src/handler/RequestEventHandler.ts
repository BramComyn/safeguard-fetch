import type { ClientHttp2Stream } from 'node:http2';
import type { Http2RequestEvent, Http2RequestEventArgumentTypes } from './eventConstants';

/**
 * Generic type for a custom request stream event handler.
 */
export type RequestEventHandler<K extends Http2RequestEvent> = (
  request: ClientHttp2Stream,
  ...args: Http2RequestEventArgumentTypes[K]
) => void;

// All possible types of request event handlers

export type AbortedEventHandler = RequestEventHandler<'aborted'>;
export type RequestCloseEventHandler = RequestEventHandler<'close'>;
export type ContinueEventHandler = RequestEventHandler<'continue'>;
export type DataEventHandler = RequestEventHandler<'data'>;
export type RequestErrorEventHandler = RequestEventHandler<'error'>;
export type RequestFrameErrorEventHandler = RequestEventHandler<'frameError'>;
export type HeadersEventHandler = RequestEventHandler<'headers'>;
export type PushEventHandler = RequestEventHandler<'push'>;
export type ReadyEventHandler = RequestEventHandler<'ready'>;
export type ResponseEventHandler = RequestEventHandler<'response'>;
export type RequestTimeoutEventHandler = RequestEventHandler<'timeout'>;
export type TrailersEventHandler = RequestEventHandler<'trailers'>;
export type WantTrailersEventHandler = RequestEventHandler<'wantTrailers'>;
