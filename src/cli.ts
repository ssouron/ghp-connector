#!/usr/bin/env node
/**
 * GHP Connector CLI
 * Main entry point for the command line interface
 */

import { Command } from 'commander';
import { getVersion } from './index';
import { handleError } from './lib/errors';

// Import command modules
import { registerIssueCommands } from './commands/issue';
// import { registerProjectCommands } from './commands/project';

// Import config manager
// import { loadConfig } from './lib/config';

// Create the root command
const program = new Command();

// Set basic information
program
  .name('ghp')
  .description('GitHub Issues and Projects CLI connector')
  .version(getVersion());

// Register all command modules
// These will be uncommented as we implement each module
registerIssueCommands(program);
// registerProjectCommands(program);

// Global options that apply to all commands
program
  .option('-o, --owner <owner>', 'GitHub repository owner')
  .option('-r, --repo <repository>', 'GitHub repository name')
  .option('-f, --format <format>', 'Output format (json, table, minimal)', 'human')
  .option('-v, --verbose', 'Enable verbose output')
  .option('--debug', 'Enable debug mode');

// Add a default command for when no command is specified
program
  .action(() => {
    if (process.argv.length <= 2) {
      program.help();
    }
  });

// Catch any unhandled errors
process.on('unhandledRejection', (error) => {
  handleError(error, program.opts().debug);
});

// Parse the command line arguments
try {
  program.parse(process.argv);
} catch (error) {
  handleError(error, program.opts().debug);
} 