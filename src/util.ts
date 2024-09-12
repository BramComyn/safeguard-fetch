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
  'SafeguardRequesterUnit',
] as const;

/**
 * Get the port to use for the test file
 *
 * @param testName - Name of the test file as defined in TEST_NAME
 */
export function getPort(testName: typeof TEST_NAME[number]): number {
  return 6001 + TEST_NAME.indexOf(testName);
}
