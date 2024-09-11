import type { CustomHeadersEventHandler } from '../headers/CustomHeadersEventHandler';

/**
 * Interface for custom event handlers that handle `response` events.
 *
 * This is entirely the same as the `CustomHeadersEventHandler` interface, but
 * it's here for the sake of consistency and to make it easier to understand
 */
export interface CustomResponseEventHandler extends CustomHeadersEventHandler<'response'> {}
