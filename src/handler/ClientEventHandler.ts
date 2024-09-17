import type TypedEmitter from 'typed-emitter';
import type { Http2ClientEvent } from './eventConstants';

/**
 * Generic type for a custom client session event emitter
 */
export type ClientEventEmitter = TypedEmitter<Http2ClientEvent>;

/**
 * Genric type for a custom client session event handler.
 */
export type ClientEventHandler<K extends keyof Http2ClientEvent> = Http2ClientEvent[K];

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
