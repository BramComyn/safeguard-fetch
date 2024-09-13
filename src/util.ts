import type { IncomingHttpHeaders } from 'node:http2';
import * as path from 'node:path';
import { readFileSync } from 'node:fs';

/**
 * Function for using pathnames from the root of the directory
 *
 * @param filePath - the relative path from the root of the directory
 */
export function fromRoot(filePath: string): string {
  return path.resolve(__dirname, '..', filePath);
}

/**
 * Secure server options for HTTP/2.0 test servers over TLS used in tests
 */
export const secureServerOptions = {
  key: readFileSync(fromRoot('assets/localhost-privkey.pem')),
  cert: readFileSync(fromRoot('assets/localhost-cert.pem')),
};

/**
 * Names of all test files
 */
const TEST_NAME = [
  'AttackServerUnit',
  'AttackServerHttp2SecureFactoryUnit',
  'AttackServerHttpFactoryUnit',
  'ContentLengthAttackServerHttp2InitialiserUnit',
  'ContentLengthAttackServerHttpInitialiserUnit',
  'RedirectAttackServerHttp2InitialiserUnit',
  'AttackResponseGeneratorUnit',
  'StandardResponseGeneratorUnit',
  'WrapperIntegration',
] as const;

/**
 * Get the port to use for the test file
 *
 * @param testName - Name of the test file as defined in TEST_NAME
 */
export function getPort(testName: typeof TEST_NAME[number]): number {
  return 6001 + TEST_NAME.indexOf(testName);
}

/**
 * Status code classes as defined in [https://www.rfc-editor.org/rfc/rfc9110.html#name-status-codes]
 */
export const STATUS_CODE_CLASSES = [
  'informational',
  'successful',
  'redirection',
  'client error',
  'server error',
] as const;

const SWITCHING_PROTOCOLS = 101;
const PARTIAL_CONTENT = 206;
const PERMANENT_REDIRECT = 308;
const UPGRADE_REQUIRED = 426;
const HTTP_VERSION_NOT_SUPPORTED = 505;

/**
 * Get the status code as integer from the incoming headers
 *
 * @param headers - The incoming headers
 *
 * @returns - The status code as integer
 */
export function getStatusCode(headers: IncomingHttpHeaders): number {
  return sanitiseStatusCode(Number.parseInt(headers[':status'] as string | undefined ?? '0', 10));
}

/**
 * Return the correct status code to act upon as [https://www.rfc-editor.org/rfc/rfc9110.html#name-status-codes] states
 *
 * @param statusCode - The status code to sanitise
 *
 * @returns - The sanitised status code
 */
export function sanitiseStatusCode(statusCode: number): number {
  if (statusCode >= 100 && statusCode <= 199) {
    return statusCode === SWITCHING_PROTOCOLS ? statusCode : 100;
  }

  if (statusCode >= 200 && statusCode <= 299) {
    return statusCode <= PARTIAL_CONTENT ? statusCode : 200;
  }

  if (statusCode >= 300 && statusCode <= 399) {
    return statusCode <= PERMANENT_REDIRECT ? statusCode : 300;
  }

  if (statusCode >= 400 && statusCode <= 499) {
    // Status code 418 is declared as unused, because of its special meaning in RFC 2324.
    return statusCode <= UPGRADE_REQUIRED && statusCode !== 418 ? statusCode : 400;
  }

  if (statusCode >= 500 && statusCode <= 599) {
    return statusCode <= HTTP_VERSION_NOT_SUPPORTED ? statusCode : 500;
  }

  // Throw an error here?
  throw new Error(`Invalid HTTP status code not asignable to status code class: ${statusCode}`);
}

/**
 * Get the status code class from the status code
 *
 * @param statusCode - The status code to get the class of
 *
 * @returns - The status code class
 */
export function getStatusCodeClass(statusCode: number): typeof STATUS_CODE_CLASSES[number] {
  const index = Math.floor(statusCode / 100) - 1;

  if (index < 0 || index >= STATUS_CODE_CLASSES.length) {
    throw new Error(`Invalid HTTP status code has no status code class: ${statusCode}`);
  }

  return STATUS_CODE_CLASSES[Math.floor(statusCode / 100) - 1];
}

/**
 * Return whether the status code indicates a successful response
 *
 * @param statusCode - The status code to check
 *
 * @returns - Whether the status code indicates a successful response
 */
export function isSuccessful(statusCode: number): boolean {
  return getStatusCodeClass(statusCode) === 'successful';
}

/**
 * Return whether the status code indicates a redirection
 *
 * @param statusCode - The status code to check
 *
 * @returns - Whether the status code indicates a redirection
 */
export function isRedirection(statusCode: number): boolean {
  return getStatusCodeClass(statusCode) === 'redirection';
}
