import type { ClientHttp2Session } from 'node:http2';
import type { Http2ClientEvent, Http2ClientEventArgumentTypes } from './eventConstants';

/**
 * Interface for any of the custom client event handlers
 * Most generic interface.
 */
export interface ClientEventHandler<K extends Http2ClientEvent> {
  /**
   * Handles the client session and the headers that were responded.
   *
   * @param session - the client session that listened to the event
   * @param args - the arguments provided to the handler via the event
   */
  handle: (
    session: ClientHttp2Session,
    ...args: Http2ClientEventArgumentTypes[K]
  ) => void;
}
