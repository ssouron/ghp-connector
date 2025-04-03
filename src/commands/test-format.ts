/**
 * Command to test formatters
 * Usage: ghp test-format [options]
 */

import { Command } from 'commander';
// Remove direct formatter import, we will use the factory later
// import { TextFormatter } from '../lib/formatters/implementations/text/TextFormatter';

// --- Import validation function and error handler ---
import { validateFormatOptions, FormatValidationOptions } from '../cli/validation';
import { handleError } from '../lib/errors';
import { defaultFactory, FormatterRuntimeOptions } from '../lib/formatters'; // Import factory for later use and FormatterRuntimeOptions
// ---------------------------------------------------

export const testFormatCommand = new Command('test-format')
  .description('Test the formatters with sample data')
  // --- Remove command-specific options replaced by global ones ---
  // .option('--no-color', 'Disable color output')
  // .option('-d, --detailed', 'Show detailed information') // Detailed might become a formatter option later
  // .option('--date-format <format>', 'Date format (ISO, local, relative)', 'local') // Date format handled by timezone/formatter config
  // ------------------------------------------------------------
  .action(async (cmdOptions, command: Command) => {
    // Get command instance
    // --- Retrieve global options ---
    // Use optsWithGlobals() for safety, although opts() might work if no name conflicts
    const options = command.optsWithGlobals<FormatValidationOptions>();
    // ---------------------------

    try {
      // --- Validate options first ---
      validateFormatOptions(options);
      // -----------------------------

      // Sample issue data (kept for testing the formatter)
      const issue = {
        number: 123,
        title: 'Test issue for formatter',
        state: 'open',
        created_at: new Date().toISOString(),
        labels: [{ name: 'bug' }, { name: 'enhancement' }],
        assignees: [{ login: 'testuser' }],
        body: 'This is a test issue to demonstrate the text formatter',
      };

      // Sample pull request data
      const pullRequest = {
        number: 456,
        title: 'Implement Text Formatter',
        state: 'open',
        created_at: new Date().toISOString(),
        head: { ref: 'feature/text-formatter' },
        base: { ref: 'main' },
        labels: [{ name: 'feature' }],
        body: 'This PR implements the text formatter as described in issue #123',
      };

      // Sample repository data
      const repository = {
        full_name: 'username/ghp-connector',
        name: 'ghp-connector',
        owner: { login: 'username' },
        html_url: 'https://github.com/username/ghp-connector',
        description: 'A CLI for interacting with GitHub Issues and Projects',
        private: false,
        language: 'TypeScript',
        default_branch: 'main',
        stargazers_count: 42,
        forks_count: 10,
        open_issues_count: 5,
      };

      // Sample issues array
      const issues = [
        { number: 1, title: 'Open Issue', state: 'open' },
        { number: 2, title: 'Closed Issue', state: 'closed' },
        { number: 3, title: 'Pending Issue', state: 'pending' },
        { number: 4, title: 'Warning Issue', state: 'warning' },
      ];

      // --- Create Formatter Runtime Options from CLI options ---
      const runtimeOptions: FormatterRuntimeOptions = {
        pretty: options.pretty,
        // Convert string indent from CLI to number, defaulting if undefined?
        // The validator ensures it's a number if present, and cli.ts sets default '2'
        indent: options.indent !== undefined ? Number(options.indent) : undefined,
        useColors: !options.noColor, // Invert noColor flag
        timezone: options.timezone,
      };
      // ---------------------------------------------------------

      // --- Instantiate formatter using Factory (will be refined in Step 6) ---
      // For now, just get the formatter based on the validated format option
      // We are not passing specific options like pretty, indent yet.
      const formatter = defaultFactory.create(options.format);
      // --------------------------------------------------------------------

      // --- Output sample data using the chosen formatter AND runtime options ---
      console.log('=== ISSUE ===');
      console.log(formatter.format(issue, runtimeOptions)); // Pass runtimeOptions
      console.log('\n=== PULL REQUEST ===');
      console.log(formatter.format(pullRequest, runtimeOptions));
      console.log('\n=== REPOSITORY ===');
      console.log(formatter.format(repository, runtimeOptions));
      console.log('\n=== ISSUES ARRAY ===');
      console.log(formatter.format(issues, runtimeOptions));
      // ----------------------------------------------------
    } catch (error) {
      // --- Use global error handler ---
      handleError(error, options.debug || false);
      // --------------------------------
    }
  });

// --- Remove direct execution block ---
// if (require.main === module) { ... }
// ------------------------------------
