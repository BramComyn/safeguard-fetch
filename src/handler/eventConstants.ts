import type { ClientHttp2Session, IncomingHttpHeaders, OutgoingHttpHeaders, Settings } from 'node:http2';
import type { Socket } from 'node:net';
import type { TLSSocket } from 'node:tls';

/**
 * The types of the arguments provided when the given event is emitted
 * on a client session.
 */
export type Http2ClientEventArgumentTypes = {
  connect: [ ClientHttp2Session, Socket | TLSSocket ];
  close: [];
  error: [ Error ];
  frameError: [ number, number, number ];
  timeout: [];
  goaway: [ number, number, Buffer ];
  localSettings: [ Settings ];
  remoteSettings: [ Settings ];
  ping: [ Buffer ];
  altsvc: [ string, string, number ];
  origin: [ string[] ];
  stream: [ ClientHttp2Session, OutgoingHttpHeaders, number, (string | Buffer)[] ];
};
export type Http2ClientEventKey = keyof Http2ClientEventArgumentTypes;

/**
 * Possible events emitted to a client session.
 */
export type Http2ClientEvents = keyof Http2ClientEventArgumentTypes;
export type Http2ClientEventEmptyArgumentEvents =
  'close' | 'timeout';

/**
 * The types of the arguments provided when the given event is emitted
 * on a request stream.
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
