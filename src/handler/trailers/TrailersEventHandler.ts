import type { HeadersEventHandler } from '../headers/HeadersEventHandler';

/**
 * Interface for the custom event handlers that handle trailers.
 *
 * This is entirely the same as the `CustomHeadersEventHandler` interface, but
 * it's here for the sake of consistency and to make it easier to understand
 */
export interface TrailersEventHandler extends HeadersEventHandler<'trailers'> {}
