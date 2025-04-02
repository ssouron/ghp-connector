/**
 * Command to test formatters
 * Usage: ghp test-format [options]
 */

import { Command } from 'commander';
import { TextFormatter } from '../lib/formatters/implementations/text/TextFormatter';

export const testFormatCommand = new Command('test-format')
  .description('Test the formatters with sample data')
  .option('--no-color', 'Disable color output')
  .option('-d, --detailed', 'Show detailed information')
  .option('--date-format <format>', 'Date format (ISO, local, relative)', 'local')
  .action(async (options) => {
    // Sample issue data
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

    // Create a formatter with the specified options
    const formatter = new TextFormatter({
      useColors: options.color !== false,
      detailed: options.detailed || false,
      dateFormat: options.dateFormat as 'ISO' | 'local' | 'relative',
    });

    // Output sample data
    console.log('=== ISSUE ===');
    console.log(formatter.format(issue));
    console.log('\n=== PULL REQUEST ===');
    console.log(formatter.format(pullRequest));
    console.log('\n=== REPOSITORY ===');
    console.log(formatter.format(repository));
    console.log('\n=== ISSUES ARRAY ===');
    console.log(formatter.format(issues));
  });

// Execute directly when run with ts-node
if (require.main === module) {
  // Set default options
  const options = {
    color: true,
    detailed: false,
    dateFormat: 'local',
  };

  // Parse command line arguments if provided
  process.argv.forEach((arg) => {
    if (arg === '--no-color') options.color = false;
    if (arg === '-d' || arg === '--detailed') options.detailed = true;
    if (arg.startsWith('--date-format=')) {
      options.dateFormat = arg.split('=')[1];
    }
  });

  // Sample issue data
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

  // Create a formatter with the specified options
  const formatter = new TextFormatter({
    useColors: options.color,
    detailed: options.detailed,
    dateFormat: options.dateFormat as 'ISO' | 'local' | 'relative',
  });

  // Output sample data
  console.log('=== ISSUE ===');
  console.log(formatter.format(issue));
  console.log('\n=== PULL REQUEST ===');
  console.log(formatter.format(pullRequest));
  console.log('\n=== REPOSITORY ===');
  console.log(formatter.format(repository));
  console.log('\n=== ISSUES ARRAY ===');
  console.log(formatter.format(issues));
}
