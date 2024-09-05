/* eslint-disable ts/naming-convention */
import { attackResponseGenerator } from '../reponse-generator/AttackResponseGenerator';
import {
  standardHttp2ResponseGenerator,
  standardHttpResponseGenerator,
} from '../reponse-generator/StandardResponseGenerator';

// Main attack server constants
const INTERVAL_TIME = 200;
const CONTENT_LENGTH = 100;
const HTTP_PORT = 8080;
const HTTPS_PORT = 8443;
const STDHTTP1MSSG = 'Infinite server endpoint (HTTP/1.1)\n';
const STDHTTP2MSSG = 'Infinite server endpoint (HTTP/2)\n';

// Attack server paths

const HTTP_SERVER_PATHS = {
  '/': standardHttpResponseGenerator(),
};

const HTTP2_SERVER_PATHS = {
  '/': standardHttp2ResponseGenerator(),
};

const PATHS = {
  '/no-difference': attackResponseGenerator(200, 200),
  '/small-difference': attackResponseGenerator(200, 100),
  '/large-difference': attackResponseGenerator(200, 10),
  '/infinite-difference': attackResponseGenerator(Infinity, 200),
  '/no-content-length-finite': attackResponseGenerator(200, null),
  '/no-content-length-infinite': attackResponseGenerator(Infinity, null),
};

export {
  INTERVAL_TIME,
  CONTENT_LENGTH,
  HTTP_PORT,
  HTTPS_PORT,
  STDHTTP1MSSG,
  STDHTTP2MSSG,
  HTTP_SERVER_PATHS,
  HTTP2_SERVER_PATHS,
  PATHS,
};
