/* eslint-disable ts/naming-convention */
import type { ResponseGenerator } from '../response-generator/ResponseGenerator';
import { AttackResponseGenerator } from '../response-generator/AttackResponseGenerator';

import {
  standardHttp2ResponseGenerator,
  standardHttpResponseGenerator,
} from '../response-generator/StandardResponseGenerator';

// Main attack server constants
export const INTERVAL_TIME = 1;
export const CONTENT_LENGTH = 100;
export const HTTP_PORT = 8080;
export const HTTPS_PORT = 8443;
export const STDHTTP1MSSG = 'Infinite server endpoint (HTTP/1.1)\n';
export const STDHTTP2MSSG = 'Infinite server endpoint (HTTP/2.0)\n';
export const MALICIOUS_REDIRECT_URL = 'https://malicious-redirect.org:666/';

// Attack server paths

/**
 * Specifies which response an HTTP/1.1 server should generate for the index
 */
export const HTTP_SERVER_PATHS = {
  '/': (): ResponseGenerator => standardHttpResponseGenerator(),
};

/**
 * Specifies which response an HTTP/2.0 server should generate for the index
 */
export const HTTP2_SERVER_PATHS = {
  '/': (): ResponseGenerator => standardHttp2ResponseGenerator(),
};

/**
 * Different paths for content length attack servers to listen to
 */
export const CONTENT_LENGTH_PATHS = {
  '/no-difference': (): ResponseGenerator => new AttackResponseGenerator(200, 200),
  '/small-difference': (): ResponseGenerator => new AttackResponseGenerator(200, 100),
  '/small-differnce-inverse': (): ResponseGenerator => new AttackResponseGenerator(100, 200),
  '/large-difference': (): ResponseGenerator => new AttackResponseGenerator(200, 10),
  '/large-difference-inverse': (): ResponseGenerator => new AttackResponseGenerator(10, 200),
  '/infinite-difference': (): ResponseGenerator => new AttackResponseGenerator(Infinity, 200),
  '/no-content-length-finite': (): ResponseGenerator => new AttackResponseGenerator(200, null),
  '/no-content-length-finite-inverse': (): ResponseGenerator => new AttackResponseGenerator(0, 200),
  '/no-content-length-infinite': (): ResponseGenerator => new AttackResponseGenerator(Infinity, null),
};

/**
 * Return type for malicious redirect attack servers
 */
interface MaliciousRedirectResponse {
  status: number;
  location: string;
}

/**
 * Different paths for malicious redirect attack servers to redirect to
 */
export const MALICIOUS_REDIRECT_PATHS = {
  '/malicious-redirect': (): MaliciousRedirectResponse => ({ status: 302, location: MALICIOUS_REDIRECT_URL }),
};
