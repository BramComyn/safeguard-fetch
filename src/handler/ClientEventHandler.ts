import type { ClientHttp2Session } from 'node:http2';
import type { Http2ClientEvent, Http2ClientEventArgumentTypes } from './eventConstants';

/**
 * Genric type for a custom client session event handler.
 */
export type ClientEventHandler<K extends Http2ClientEvent> = (
  session: ClientHttp2Session,
  ...args: Http2ClientEventArgumentTypes[K]
) => void;

// All possible types of client event handlers

export type AltsvcEventHandler = ClientEventHandler<'altsvc'>;
export type ClientCloseEventHandler = ClientEventHandler<'close'>;
export type ConnectEventHandler = ClientEventHandler<'connect'>;
export type ClientErrorEventHandler = ClientEventHandler<'error'>;
export type ClientFrameErrorEventHandler = ClientEventHandler<'frameError'>;
export type GoawayEventHandler = ClientEventHandler<'goaway'>;
export type LocalSettingsEventHandler = ClientEventHandler<'localSettings'>;
export type OriginEventHandler = ClientEventHandler<'origin'>;
export type PingEventHandler = ClientEventHandler<'ping'>;
export type RemoteSettingsEventHandler = ClientEventHandler<'remoteSettings'>;
export type StreamEventHandler = ClientEventHandler<'stream'>;
export type ClientTimeoutEventHandler = ClientEventHandler<'timeout'>;
