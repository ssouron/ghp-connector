/**
 * Test script for formatters
 * Run with: npx ts-node src/test-formatter.ts
 */

import { TextFormatter } from './lib/formatters/implementations/text/TextFormatter';

// Sample data to format
const issue = {
  number: 123,
  title: 'Test issue for formatter',
  state: 'open',
  created_at: new Date().toISOString(),
  labels: [{ name: 'bug' }, { name: 'enhancement' }],
  assignees: [{ login: 'testuser' }],
  body: 'This is a test issue to demonstrate the text formatter',
};

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

const user = {
  login: 'testuser',
  name: 'Test User',
  html_url: 'https://github.com/testuser',
  bio: 'Software developer and open source contributor',
  company: 'Test Company',
  location: 'Paris, France',
  email: 'test@example.com',
  public_repos: 25,
  followers: 100,
};

const issues = [
  { number: 1, title: 'First Issue', state: 'open' },
  { number: 2, title: 'Second Issue', state: 'closed' },
];

// Create formatters
const textFormatter = new TextFormatter({ useColors: true });

// Test with TextFormatter
console.log('\n--- TextFormatter Output ---\n');
console.log('▶️ Issue:');
console.log(textFormatter.format(issue));
console.log('\n▶️ Pull Request:');
console.log(textFormatter.format(pullRequest));
console.log('\n▶️ Repository:');
console.log(textFormatter.format(repository));
console.log('\n▶️ User:');
console.log(textFormatter.format(user));
console.log('\n▶️ Issue Array:');
console.log(textFormatter.format(issues));

// Test with different configuration options
console.log('\n--- TextFormatter with Different Options ---\n');

// Without colors
console.log('▶️ Without colors:');
const noColorFormatter = new TextFormatter({ useColors: false });
console.log(noColorFormatter.format(issue));

// With detailed view
console.log('\n▶️ With detailed view:');
const detailedFormatter = new TextFormatter({ detailed: true });
console.log(detailedFormatter.format(issue));

// With ISO date format
console.log('\n▶️ With ISO date format:');
const isoDateFormatter = new TextFormatter({ dateFormat: 'ISO' });
console.log(isoDateFormatter.format(issue));

// With relative date format
console.log('\n▶️ With relative date format:');
const relativeDateFormatter = new TextFormatter({ dateFormat: 'relative' });
console.log(relativeDateFormatter.format(issue));
