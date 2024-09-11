import type { IncomingHttpHeaders } from 'node:http2';
/**
 * Possible events emitted to a client session.
 */
// TODO [2024-09-11]: add type
export const HTTP2_CLIENT_EVENTS = [
  'connect',
  'close',
  'error',
  'frameError',
  'timeout',
  'goaway',
  'localSettings',
  'remoteSettings',
  'ping',
  'altsvc',
  'origin',
] as const;
export type Http2ClientEventKey = typeof HTTP2_CLIENT_EVENTS[number];

/**
 * The types of the arguments provided when the given event is emitted.
 */
// TODO [2024-09-11]

/**
 * The types of the arguments provided when the given event is emitted.
 */
export type Http2RequestEventArgumentTypes = {
  close: [];
  error: [ Error ];
  frameError: [ number, number, number ];
  timeout: [];
  ready: [];
  aborted: [];
  trailers: [ IncomingHttpHeaders, number ];
  wantTrailers: [];
  continue: [];
  headers: [ IncomingHttpHeaders, number ];
  push: [ IncomingHttpHeaders, number ];
  response: [ IncomingHttpHeaders, number ];
  data: [ Buffer ];
};
export type Http2RequestEventKey = keyof Http2RequestEventArgumentTypes;

/**
 * Possible events emitted to a request stream.
 */
export type Http2RequestEvents = keyof Http2RequestEventArgumentTypes;
export type Http2RequestEventEmptyArgumentEvents =
  'close' | 'timeout' | 'ready' | 'aborted' | 'wantTrailers' | 'continue';
