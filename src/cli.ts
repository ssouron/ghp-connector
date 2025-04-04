#!/usr/bin/env node
/**
 * GHP Connector CLI
 * Main entry point for the command line interface
 */

import { Command, Option } from 'commander';
import { getVersion, createEnterpriseCommand, createTokenCommand } from './index';
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

// Create a string with global options for help text
const globalOptionsHelp = `
Global Options:
  -o, --owner <owner>        GitHub repository owner
  -r, --repo <repository>    GitHub repository name
  -f, --format <format>      ${formatDescription} (default: "${defaultFormat}")
  --no-color                 Disable color output (text/human formats)
  --pretty                   Pretty print output (json format)
  --indent <number>          Indentation level for pretty printing (json format) (default: "2")
  --timezone <zone>          Timezone for date formatting (e.g., UTC, America/New_York)
  -v, --verbose              Enable verbose output
  --debug                    Enable debug mode
  -h, --help                 Display help
  -V, --version              Display version
`;

// Use a simpler approach to modify help output
program.addHelpText('afterAll', () => globalOptionsHelp);

// Also add a note to all subcommands about global options
testFormatCommand.addHelpText(
  'afterAll',
  '\nNote: Global options (--format, --owner, etc.) can be used with this command.\nRun "ghp --help" to see all global options.\n'
);

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

// Add help text to config command as well
configCommand.addHelpText(
  'afterAll',
  '\nNote: Global options (--format, --owner, etc.) can be used with this command.\nRun "ghp --help" to see all global options.\n'
);

// Register all command modules
// Add enterprise and token commands
const enterpriseCommand = createEnterpriseCommand();
const tokenCommand = createTokenCommand();

// Add help text to these commands as well
enterpriseCommand.addHelpText(
  'afterAll',
  '\nNote: Global options (--format, --owner, etc.) can be used with this command.\nRun "ghp --help" to see all global options.\n'
);
tokenCommand.addHelpText(
  'afterAll',
  '\nNote: Global options (--format, --owner, etc.) can be used with this command.\nRun "ghp --help" to see all global options.\n'
);

program.addCommand(testFormatCommand);
program.addCommand(enterpriseCommand);
program.addCommand(tokenCommand);

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
