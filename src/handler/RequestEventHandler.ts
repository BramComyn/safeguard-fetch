import type TypedEmitter from 'typed-emitter';
import type { Http2RequestEvent } from './eventConstants';

/**
 * Generic type for a custom request stream event emitter.
 */
export type RequestEventEmitter = TypedEmitter<Http2RequestEvent>;

/**
 * Generic type for a custom request stream event handler.
 */
export type RequestEventHandler<K extends keyof Http2RequestEvent> = Http2RequestEvent[K];

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
