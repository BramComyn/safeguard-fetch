import * as path from 'node:path';
import { readFileSync } from 'node:fs';

/**
 * Function for using pathnames from the root of the directory
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
