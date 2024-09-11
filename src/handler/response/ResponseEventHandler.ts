import type { HeadersEventHandler } from '../headers/HeadersEventHandler';

/**
 * Interface for custom event handlers that handle `response` events.
 *
 * This is entirely the same as the `CustomHeadersEventHandler` interface, but
 * it's here for the sake of consistency and to make it easier to understand
 */
export interface ResponseEventHandler extends HeadersEventHandler<'response'> {}
