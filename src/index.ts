/**
 * GHP Connector
 * Une bibliothèque pour interagir avec les Issues et Projects GitHub
 */

// Export library modules
export * from './lib';

// Exports commands
export * from './commands';

// Read version from package.json
import { readFileSync } from 'fs';
import { join } from 'path';

// Export package version
export const getVersion = (): string => {
  try {
    const packageJsonPath = join(__dirname, '..', 'package.json');
    const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'));
    return packageJson.version || '0.3.0'; // Fallback to 0.3.0 if not found
  } catch (error) {
    return '0.3.0'; // Current version as fallback
  }
};

// Export command creators for use in cli.ts
export { createEnterpriseCommand } from './commands/enterprise';
export { createTokenCommand } from './commands/token';
