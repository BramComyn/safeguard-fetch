import type {
  ClientHttp2Session,
  ClientHttp2Stream,
  Http2Stream,
  IncomingHttpHeaders,
  OutgoingHttpHeaders,
  Settings,
} from 'node:http2';

import type { Socket } from 'node:net';
import type { TLSSocket } from 'node:tls';

/**
 * The types of arguments provided when the given event is emitted
 * to a client session or request stream. These include the common
 * events that can be emitted to both a client session and a request.
 */
export type Http2Event<T extends ClientHttp2Session | ClientHttp2Stream> = {
  close: (emitter: T) => void;
  error: (emitter: T, err: Error) => void;
  frameError: (emitter: T, type: number, code: number, id: number) => void;
  timeout: (emitter: T) => void;
};

/**
 * The types of the arguments provided when the given event is emitted
 * on a client session.
 */
export type Http2ClientEvent = {
  connect: (client: ClientHttp2Session, session: ClientHttp2Session, socket: Socket | TLSSocket) => void;
  goaway: (client: ClientHttp2Session, errorCode: number, lastStreamID: number, opaqueData: Buffer) => void;
  localSettings: (client: ClientHttp2Session, settings: Settings) => void;
  remoteSettings: (client: ClientHttp2Session, settings: Settings) => void;
  ping: (client: ClientHttp2Session, data: Buffer) => void;
  altsvc: (client: ClientHttp2Session, origin: string, field: string, port: number) => void;
  origin: (client: ClientHttp2Session, origins: string[]) => void;
  stream: (
    client: ClientHttp2Session,
    stream: Http2Stream,
    headers: OutgoingHttpHeaders,
    flags: number,
    rawHeaders: (string | Buffer)[],
  ) => void;
} & Http2Event<ClientHttp2Session>;

/**
 * The types of the arguments provided when the given event is emitted
 * on a request stream.
 */
export type Http2RequestEvent = {
  ready: (request: ClientHttp2Stream) => void;
  aborted: (request: ClientHttp2Stream) => void;
  trailers: (request: ClientHttp2Stream, headers: IncomingHttpHeaders, flags: number) => void;
  wantTrailers: (request: ClientHttp2Stream) => void;
  continue: (request: ClientHttp2Stream) => void;
  headers: (request: ClientHttp2Stream, headers: IncomingHttpHeaders, flags: number) => void;
  push: (request: ClientHttp2Stream, headers: IncomingHttpHeaders, flags: number) => void;
  response: (request: ClientHttp2Stream, headers: IncomingHttpHeaders) => void;
  data: (request: ClientHttp2Stream, chunk: Buffer) => void;
} & Http2Event<ClientHttp2Stream>;
