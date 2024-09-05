import * as path from 'node:path';

// Function for using pathnames from the root of the directory
export function fromRoot(filePath: string): string {
  return path.resolve(__dirname, '..', filePath);
}
