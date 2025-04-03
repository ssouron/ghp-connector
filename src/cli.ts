#!/usr/bin/env node
/**
 * GHP Connector CLI
 * Main entry point for the command line interface
 */

import { Command, Option } from 'commander';
import { getVersion } from './index';
import { handleError } from './lib/errors';
// import { loadConfig } from './lib/config'; // Removed unused import
import os from 'os';

// Import command modules
// import { /* Command types/interfaces if needed */ } from './commands/base'; // Removed non-existent import

// Import config manager related stuff (if needed elsewhere)
import { /* cmdArgsToConfig, */ initConfigFile, CONFIG_FILENAME } from './lib/config'; // Removed unused cmdArgsToConfig
import path from 'path';

// Import our test format command
import { testFormatCommand } from './commands/test-format';

// --- Import Formatter Registry and Option ---
import { defaultRegistry } from './lib/formatters';
// -------------------------------------------

// Create the root command
const program = new Command();

// Set basic information
program
  .name('ghp')
  .description('GHP Connector: CLI for GitHub Issues and Projects') // Use the clearer description
  .version(getVersion());

// --- Get available formats and default format ---
const availableFormats = defaultRegistry.getRegisteredFormats();
const defaultFormat = defaultRegistry.getDefaultFormat();
const formatDescription = `Output format (${availableFormats.join(' | ')})`;
// ---------------------------------------------

// --- Create the format option using imported Option ---
const formatOption = new Option('-f, --format <format>', formatDescription)
  .default(defaultFormat)
  .choices(availableFormats);
// -----------------------------------------------------

// Global options that apply to all commands
program
  .option('-o, --owner <owner>', 'GitHub repository owner') // Restore these global options
  .option('-r, --repo <repository>', 'GitHub repository name')
  .addOption(formatOption) // Add the dynamic format option
  .option('-v, --verbose', 'Enable verbose output')
  .option('--debug', 'Enable debug mode');

// --- Add format-specific global options ---
program
  .option('--no-color', 'Disable color output (text/human formats)')
  .option('--pretty', 'Pretty print output (json format)')
  .option('--indent <number>', 'Indentation level for pretty printing (json format)', '2') // Default to 2 spaces
  .option('--timezone <zone>', 'Timezone for date formatting (e.g., UTC, America/New_York)');
// -----------------------------------------

// Add config command
const configCommand = program.command('config').description('Manage GHP configuration');

// Add init subcommand
configCommand
  .command('init')
  .description('Initialize a new configuration file')
  .option('-g, --global', 'Create a global configuration file in your home directory')
  .action((options) => {
    try {
      const targetPath = options.global
        ? path.join(os.homedir(), CONFIG_FILENAME)
        : path.join(process.cwd(), CONFIG_FILENAME);

      initConfigFile(targetPath);
      console.log(`Configuration file created at: ${targetPath}`);
    } catch (error) {
      handleError(error, program.opts().debug);
    }
  });

// Register all command modules
// For now, just registering the test command
program.addCommand(testFormatCommand);

// TODO: Add more commands here

// Catch any unhandled errors (restore this)
process.on('unhandledRejection', (error) => {
  handleError(error, program.opts().debug);
});

// Parse the command line arguments (restore this simple parse call)
try {
  program.parse(process.argv);
} catch (error) {
  // Commander can throw errors during parsing (e.g., invalid choices)
  handleError(error, program.opts().debug);
}

// The check for no args should likely happen *before* parsing or be handled by commander's default behavior
// Let's remove the post-parse check for now, assuming commander handles no args/command by showing help.
// if (!process.argv.slice(2).length) {
//   program.outputHelp();
// }
