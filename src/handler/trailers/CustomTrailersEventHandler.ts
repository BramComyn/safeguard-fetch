import type { CustomHeadersEventHandler } from '../headers/CustomHeadersEventHandler';

/**
 * Interface for the custom event handlers that handle trailers.
 *
 * This is entirely the same as the `CustomHeadersEventHandler` interface, but
 * it's here for the sake of consistency and to make it easier to understand
 */
export interface CustomTrailersEventHandler extends CustomHeadersEventHandler {}
