import { AttackResponseGenerator } from '../response-generator/AttackResponseGenerator';

import {
  standardHttp2ResponseGenerator,
  standardHttpResponseGenerator,
} from '../response-generator/StandardResponseGenerator';

import { JsonLdResponseGenerator } from '../response-generator/JsonLdResponseGenerator';
import { TurtleResponseGenerator } from '../response-generator/TurtleResponseGenerator';
import { RedirectResponseGenerator } from '../response-generator/RedirectResponseGenerator';

// Main attack server constants
export const HTTP_PORT = 8080;
export const HTTPS_PORT = 8443;

export const STD_MALICIOUS_REDIRECT_PATH = '/malicious-redirect';
export const NON_MALICIOUS_REDIRECT_PATH = '/non-malicious-redirect';
export const MALICIOUS_REDIRECT_URL = 'https://malicious-redirect.org:666/';
export const NON_MALICIOUS_REDIRECT_URL = 'https://non-malicious-redirect.org:666/';

// Attack server paths

/**
 * Specifies which response an HTTP/1.1 content length attack server should generate for the index
 */
export const HTTP_SERVER_PATHS = {
  '/': standardHttpResponseGenerator(),
};

/**
 * Specifies which response an HTTP/2.0 content length attack server should generate for the index
 */
export const HTTP2_SERVER_PATHS = {
  '/': standardHttp2ResponseGenerator(),
};

/**
 * Different paths for content length attack servers to listen to
 */
export const CONTENT_LENGTH_PATHS = {
  '/no-difference': new AttackResponseGenerator(200, 200),
  '/small-difference': new AttackResponseGenerator(200, 100),
  '/small-difference-inverse': new AttackResponseGenerator(100, 200),
  '/large-difference': new AttackResponseGenerator(200, 10),
  '/large-difference-inverse': new AttackResponseGenerator(10, 200),
  '/infinite-difference': new AttackResponseGenerator(Infinity, 200),
  '/no-content-length-finite': new AttackResponseGenerator(200, null),
  '/no-content-length-finite-inverse': new AttackResponseGenerator(0, 200),
  '/no-content-length-infinite': new AttackResponseGenerator(Infinity, null),
} as const;

export const JSONLD_PATHS = {
  '/json-ld': new JsonLdResponseGenerator(),
} as const;

export const TURTLE_PATHS = {
  '/turtle': new TurtleResponseGenerator(),
} as const;

/**
 * Different paths for malicious redirect attack servers to redirect to
 */
export const MALICIOUS_REDIRECT_PATHS = {
  '/malicious-redirect': new RedirectResponseGenerator(302, MALICIOUS_REDIRECT_URL),
  '/non-malicious-redirect': new RedirectResponseGenerator(302, NON_MALICIOUS_REDIRECT_URL),
} as const;
