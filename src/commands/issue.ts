/**
 * Issue commands
 * Commands for working with GitHub issues
 */

import { Command } from 'commander';
import { 
  GitHubClient, 
  loadConfig, 
  formatOutput, 
  wrapWithErrorHandler, 
  ValidationError,
  FormatType 
} from '../lib';

/**
 * Register issue commands with the CLI
 */
export function registerIssueCommands(program: Command): void {
  const issueCommand = program
    .command('issue')
    .description('Manage GitHub issues');

  // List issues
  issueCommand
    .command('list')
    .description('List issues in a repository')
    .option('-s, --state <state>', 'Issue state (open, closed, all)', 'open')
    .option('-l, --limit <limit>', 'Maximum number of issues to return', '10')
    .option('-a, --assignee <assignee>', 'Filter by assignee')
    .option('-L, --label <labels>', 'Filter by label, comma-separated')
    .option('-S, --sort <sort>', 'Sort issues by (created, updated, comments)', 'created')
    .option('-d, --direction <direction>', 'Sort direction (asc, desc)', 'desc')
    .action(wrapWithErrorHandler(listIssues));

  // Get issue
  issueCommand
    .command('get')
    .description('Get details of a specific issue')
    .argument('<issue-number>', 'Issue number')
    .action(wrapWithErrorHandler(getIssue));

  // Create issue
  issueCommand
    .command('create')
    .description('Create a new issue')
    .requiredOption('-t, --title <title>', 'Issue title')
    .option('-b, --body <body>', 'Issue body')
    .option('-a, --assignees <assignees>', 'Comma-separated list of assignees')
    .option('-L, --labels <labels>', 'Comma-separated list of labels')
    .action(wrapWithErrorHandler(createIssue));

  // Update issue
  issueCommand
    .command('update')
    .description('Update an existing issue')
    .argument('<issue-number>', 'Issue number')
    .option('-t, --title <title>', 'New issue title')
    .option('-b, --body <body>', 'New issue body')
    .option('-s, --state <state>', 'Issue state (open, closed)')
    .option('-a, --assignees <assignees>', 'Comma-separated list of assignees')
    .option('-L, --labels <labels>', 'Comma-separated list of labels')
    .action(wrapWithErrorHandler(updateIssue));
}

/**
 * List issues in a repository
 */
async function listIssues(options: any): Promise<void> {
  // Parse command line options
  const formatType = options.parent.parent.opts().format as FormatType;
  const verbose = options.parent.parent.opts().verbose || false;
  
  // Load config and merge with command line options
  const config = loadConfig({
    github: {
      owner: options.parent.parent.opts().owner,
      repo: options.parent.parent.opts().repo,
    },
  });
  
  // Create GitHub client
  const client = GitHubClient.fromConfig(config);
  
  // Prepare API options
  const apiOptions = {
    state: options.state || config.defaults.issues.state,
    per_page: parseInt(options.limit, 10) || 10,
    assignee: options.assignee,
    labels: options.label,
    sort: options.sort,
    direction: options.direction,
  };
  
  // Optional extra information in verbose mode
  if (verbose) {
    console.log(`Fetching issues from ${config.github.owner}/${config.github.repo}`);
    console.log(`Options: ${JSON.stringify(apiOptions)}`);
  }
  
  // Fetch issues
  const issues = await client.listIssues(apiOptions);
  
  // Print results
  console.log(formatOutput(issues, formatType));
}

/**
 * Get details of a specific issue
 */
async function getIssue(issueNumber: string, options: any): Promise<void> {
  // Parse command line options
  const formatType = options.parent.parent.opts().format as FormatType;
  const verbose = options.parent.parent.opts().verbose || false;
  
  // Validate issue number
  const issueId = parseInt(issueNumber, 10);
  if (isNaN(issueId)) {
    throw new ValidationError('Issue number must be a valid number');
  }
  
  // Load config and merge with command line options
  const config = loadConfig({
    github: {
      owner: options.parent.parent.opts().owner,
      repo: options.parent.parent.opts().repo,
    },
  });
  
  // Create GitHub client
  const client = GitHubClient.fromConfig(config);
  
  // Optional extra information in verbose mode
  if (verbose) {
    console.log(`Fetching issue #${issueId} from ${config.github.owner}/${config.github.repo}`);
  }
  
  // Fetch issue
  const issue = await client.getIssue(issueId);
  
  // Print results
  console.log(formatOutput(issue, formatType));
}

/**
 * Create a new issue
 */
async function createIssue(options: any): Promise<void> {
  // Parse command line options
  const formatType = options.parent.parent.opts().format as FormatType;
  const verbose = options.parent.parent.opts().verbose || false;
  
  // Validate required fields
  if (!options.title) {
    throw new ValidationError('Issue title is required');
  }
  
  // Load config and merge with command line options
  const config = loadConfig({
    github: {
      owner: options.parent.parent.opts().owner,
      repo: options.parent.parent.opts().repo,
    },
  });
  
  // Create GitHub client
  const client = GitHubClient.fromConfig(config);
  
  // Prepare API options
  const apiOptions: Record<string, any> = {};
  
  if (options.assignees) {
    apiOptions.assignees = options.assignees.split(',').map((a: string) => a.trim());
  }
  
  if (options.labels) {
    apiOptions.labels = options.labels.split(',').map((l: string) => l.trim());
  }
  
  // Optional extra information in verbose mode
  if (verbose) {
    console.log(`Creating issue in ${config.github.owner}/${config.github.repo}`);
    console.log(`Title: ${options.title}`);
    if (options.body) console.log(`Body: ${options.body}`);
    if (apiOptions.assignees) console.log(`Assignees: ${apiOptions.assignees.join(', ')}`);
    if (apiOptions.labels) console.log(`Labels: ${apiOptions.labels.join(', ')}`);
  }
  
  // Create issue
  const issue = await client.createIssue(options.title, options.body, apiOptions);
  
  // Print results
  console.log(formatOutput(issue, formatType));
}

/**
 * Update an existing issue
 */
async function updateIssue(issueNumber: string, options: any): Promise<void> {
  // Parse command line options
  const formatType = options.parent.parent.opts().format as FormatType;
  const verbose = options.parent.parent.opts().verbose || false;
  
  // Validate issue number
  const issueId = parseInt(issueNumber, 10);
  if (isNaN(issueId)) {
    throw new ValidationError('Issue number must be a valid number');
  }
  
  // Load config and merge with command line options
  const config = loadConfig({
    github: {
      owner: options.parent.parent.opts().owner,
      repo: options.parent.parent.opts().repo,
    },
  });
  
  // Create GitHub client
  const client = GitHubClient.fromConfig(config);
  
  // Prepare API options
  const apiOptions: Record<string, any> = {};
  
  if (options.title) apiOptions.title = options.title;
  if (options.body) apiOptions.body = options.body;
  if (options.state) apiOptions.state = options.state;
  
  if (options.assignees) {
    apiOptions.assignees = options.assignees.split(',').map((a: string) => a.trim());
  }
  
  if (options.labels) {
    apiOptions.labels = options.labels.split(',').map((l: string) => l.trim());
  }
  
  // Optional extra information in verbose mode
  if (verbose) {
    console.log(`Updating issue #${issueId} in ${config.github.owner}/${config.github.repo}`);
    Object.entries(apiOptions).forEach(([key, value]) => {
      console.log(`${key}: ${value}`);
    });
  }
  
  // Update issue
  const issue = await client.updateIssue(issueId, apiOptions);
  
  // Print results
  console.log(formatOutput(issue, formatType));
} 