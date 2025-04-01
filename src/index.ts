/**
 * GHP Connector
 * Une bibliothèque pour interagir avec les Issues et Projects GitHub
 */

// Export library modules
export * from './lib';

// Exports commands
export * from './commands';

// Export package version
export const getVersion = (): string => {
  return '0.0.2';
};

import { Command } from 'commander';
import { createEnterpriseCommand } from './commands/enterprise';
import { createTokenCommand } from './commands/token';

const program = new Command();

program.name('ghp-connector').description('GitHub Projects Connector CLI').version('0.1.0');

program.addCommand(createEnterpriseCommand());
program.addCommand(createTokenCommand());

program.parse(process.argv);

export default program;
