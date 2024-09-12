import type { ClientHttp2Session, Http2Stream, IncomingHttpHeaders, OutgoingHttpHeaders, Settings } from 'node:http2';
import type { Socket } from 'node:net';
import type { TLSSocket } from 'node:tls';

/**
 * The types of arguments provided when the given event is emitted
 * to a client session or request stream. These include the common
 * events that can be emitted to both a client session and a request.
 */
export type Http2EventArgumentTypes = {
  close: [];
  error: [ Error ];
  frameError: [ number, number, number ];
  timeout: [];
};

/**
 * The types of the arguments provided when the given event is emitted
 * on a client session.
 */
export type Http2ClientEventArgumentTypes = {
  connect: [ ClientHttp2Session, Socket | TLSSocket ];
  goaway: [ number, number, Buffer ];
  localSettings: [ Settings ];
  remoteSettings: [ Settings ];
  ping: [ Buffer ];
  altsvc: [ string, string, number ];
  origin: [ string[] ];
  stream: [ Http2Stream, OutgoingHttpHeaders, number, (string | Buffer)[] ];
} & Http2EventArgumentTypes;
export type Http2ClientEvent = keyof Http2ClientEventArgumentTypes;

/**
 * Possible events emitted to a client session.
 */
export type Http2ClientEventEmptyArgumentEvents =
  'close' | 'timeout';

/**
 * The types of the arguments provided when the given event is emitted
 * on a request stream.
 */
export type Http2RequestEventArgumentTypes = {
  ready: [];
  aborted: [];
  trailers: [ IncomingHttpHeaders, number ];
  wantTrailers: [];
  continue: [];
  headers: [ IncomingHttpHeaders, number ];
  push: [ IncomingHttpHeaders, number ];
  response: [ IncomingHttpHeaders, number ];
  data: [ Buffer ];
} & Http2EventArgumentTypes;
export type Http2RequestEvent = keyof Http2RequestEventArgumentTypes;

/**
 * Possible events emitted to a request stream.
 */
export type Http2RequestEventEmptyArgumentEvents =
  'close' | 'timeout' | 'ready' | 'aborted' | 'wantTrailers' | 'continue';
