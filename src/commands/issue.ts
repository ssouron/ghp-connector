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
  FormatType,
  cmdArgsToConfig,
} from '../lib';

/**
 * Register issue commands with the CLI
 */
export function registerIssueCommands(program: Command): void {
  const issueCommand = program.command('issue').description('Manage GitHub issues');

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
    .option('-m, --milestone <milestone>', 'Filter by milestone (number or "none")')
    .option('-c, --creator <creator>', 'Filter by the creator of the issue')
    .option('-M, --mentioned <mentioned>', 'Filter by user mentioned in the issue')
    .option('--since <date>', 'Filter by issues updated since the given date (ISO 8601 format)')
    .addHelpText(
      'after',
      `
Examples:
  $ ghp issue list                                        List open issues
  $ ghp issue list --state=closed                         List closed issues
  $ ghp issue list --label=bug --state=open               List open issues with the 'bug' label
  $ ghp issue list --assignee=username --limit=10         List 10 issues assigned to 'username'
  $ ghp issue list --sort=updated --direction=desc        List issues sorted by last updated
  $ ghp issue list --milestone=1                          List issues in milestone 1
  $ ghp issue list --format=json > issues.json            Export issues as JSON
    `
    )
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
 * Détecte le format demandé à partir des options globales et des arguments
 * @param globalOpts Options globales passées par commander
 * @returns Le format à utiliser pour l'affichage
 */
function detectFormat(globalOpts: Record<string, any>): FormatType {
  // Vérifier si les options de format sont passées directement en arguments
  const formatFromArgs = getFormatFromArgs();

  // Priorité: 1. Format dans les arguments bruts, 2. Format dans les options globales, 3. Format par défaut (human)
  return formatFromArgs || globalOpts.format || 'human';
}

/**
 * Extrait le format spécifié par les arguments de ligne de commande
 * @returns Le format spécifié ou undefined si aucun n'est spécifié
 */
function getFormatFromArgs(): FormatType | undefined {
  // Vérification de l'option courte: -f <format>
  if (process.argv.includes('-f') && process.argv.indexOf('-f') + 1 < process.argv.length) {
    const format = process.argv[process.argv.indexOf('-f') + 1];
    return isValidFormat(format) ? (format as FormatType) : undefined;
  }

  // Vérification de l'option longue: --format=<format> ou --format <format>
  const formatOption = process.argv.find((arg) => arg.startsWith('--format='));
  if (formatOption) {
    const format = formatOption.split('=')[1];
    return isValidFormat(format) ? (format as FormatType) : undefined;
  }

  if (process.argv.includes('--format') && process.argv.indexOf('--format') + 1 < process.argv.length) {
    const format = process.argv[process.argv.indexOf('--format') + 1];
    return isValidFormat(format) ? (format as FormatType) : undefined;
  }

  return undefined;
}

/**
 * Vérifie si le format spécifié est valide
 * @param format Format à vérifier
 * @returns true si le format est valide, false sinon
 */
function isValidFormat(format: string): boolean {
  const validFormats: FormatType[] = ['json', 'text', 'table', 'minimal', 'human', 'csv'];
  return validFormats.includes(format as FormatType);
}

/**
 * List issues in a repository
 */
async function listIssues(options: any): Promise<void> {
  // Les options globales peuvent être dans différents endroits selon la structure de commander
  const globalOpts = options._optionValues || {};

  // Parse command line options - prioritize direct options over parent options
  const formatType = detectFormat(globalOpts);
  const verbose = globalOpts.verbose || false;

  // Load config and merge with command line options
  const config = loadConfig(cmdArgsToConfig(globalOpts));

  // Create GitHub client
  const client = GitHubClient.fromConfig(config);

  // Prepare API options
  const apiOptions: Record<string, any> = {
    state: options.state || config.defaults?.issues?.state || 'open',
    per_page: parseInt(options.limit, 10) || 10,
  };

  // Add filters if provided
  if (options.assignee) apiOptions.assignee = options.assignee;
  if (options.label) apiOptions.labels = options.label;
  if (options.sort) apiOptions.sort = options.sort;
  if (options.direction) apiOptions.direction = options.direction;
  if (options.milestone) apiOptions.milestone = options.milestone;
  if (options.creator) apiOptions.creator = options.creator;
  if (options.mentioned) apiOptions.mentioned = options.mentioned;
  if (options.since) apiOptions.since = options.since;

  // Validate input options
  if (apiOptions.state && !['open', 'closed', 'all'].includes(apiOptions.state)) {
    throw new ValidationError('State must be one of: open, closed, all');
  }

  if (apiOptions.sort && !['created', 'updated', 'comments'].includes(apiOptions.sort)) {
    throw new ValidationError('Sort must be one of: created, updated, comments');
  }

  if (apiOptions.direction && !['asc', 'desc'].includes(apiOptions.direction)) {
    throw new ValidationError('Direction must be one of: asc, desc');
  }

  if (apiOptions.per_page < 1 || apiOptions.per_page > 100) {
    throw new ValidationError('Limit must be between 1 and 100');
  }

  // Optional extra information in verbose mode
  if (verbose) {
    console.log(`Fetching issues from ${config.github.owner}/${config.github.repo}`);
    console.log(`Options: ${JSON.stringify(apiOptions)}`);
  }

  try {
    // Fetch issues
    const issues = await client.listIssues(apiOptions);

    // Handle no results
    if (issues.length === 0) {
      console.log('No issues found matching your criteria');
      return;
    }

    // Utiliser le formatOutput avec le format détecté
    console.log(formatOutput(issues, formatType));
  } catch (error) {
    // Handle common API issues
    if (error instanceof Error) {
      if (error.message.includes('rate limit')) {
        throw new Error('GitHub API rate limit exceeded. Please wait or provide a valid token.');
      } else if (error.message.includes('network')) {
        throw new Error('Network error occurred. Please check your internet connection.');
      } else if (error.message.includes('401')) {
        throw new Error('Authentication error. Please check your GitHub token.');
      } else if (error.message.includes('404')) {
        throw new Error(`Repository ${config.github.owner}/${config.github.repo} not found or you don't have access.`);
      }
    }
    // Re-throw other errors
    throw error;
  }
}

/**
 * Get details of a specific issue
 */
async function getIssue(issueNumber: string, options: any): Promise<void> {
  // Les options globales peuvent être dans différents endroits selon la structure de commander
  const globalOpts = options._optionValues || {};

  // Parse command line options - prioritize direct options over parent options
  const formatType = detectFormat(globalOpts);
  const verbose = globalOpts.verbose || false;

  // Validate issue number
  const issueId = parseInt(issueNumber, 10);
  if (isNaN(issueId)) {
    throw new ValidationError('Issue number must be a valid number');
  }

  // Load config and merge with command line options
  const config = loadConfig(cmdArgsToConfig(globalOpts));

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
  // Les options globales peuvent être dans différents endroits selon la structure de commander
  const globalOpts = options._optionValues || {};

  // Parse command line options - prioritize direct options over parent options
  const formatType = detectFormat(globalOpts);
  const verbose = globalOpts.verbose || false;

  // Validate required fields
  if (!options.title) {
    throw new ValidationError('Issue title is required');
  }

  // Load config and merge with command line options
  const config = loadConfig(cmdArgsToConfig(globalOpts));

  // Create GitHub client
  const client = GitHubClient.fromConfig(config);

  // Prepare API options
  const apiOptions: Record<string, any> = {};

  // Add issue details
  apiOptions.title = options.title;
  if (options.body) apiOptions.body = options.body;
  if (options.assignees) apiOptions.assignees = options.assignees.split(',').map((a: string) => a.trim());
  if (options.labels) apiOptions.labels = options.labels.split(',').map((l: string) => l.trim());

  // Optional extra information in verbose mode
  if (verbose) {
    console.log(`Creating issue in ${config.github.owner}/${config.github.repo}`);
    console.log(`Options: ${JSON.stringify(apiOptions)}`);
  }

  // Create issue
  const issue = await client.createIssue({
    title: options.title,
    body: options.body,
    assignees: apiOptions.assignees,
    labels: apiOptions.labels,
  });

  // Print results
  console.log(formatOutput(issue, formatType));
}

/**
 * Update an existing issue
 */
async function updateIssue(issueNumber: string, options: any): Promise<void> {
  // Les options globales peuvent être dans différents endroits selon la structure de commander
  const globalOpts = options._optionValues || {};

  // Parse command line options - prioritize direct options over parent options
  const formatType = detectFormat(globalOpts);
  const verbose = globalOpts.verbose || false;

  // Validate issue number
  const issueId = parseInt(issueNumber, 10);
  if (isNaN(issueId)) {
    throw new ValidationError('Issue number must be a valid number');
  }

  // Check if at least one update option is provided
  if (!options.title && !options.body && !options.state && !options.assignees && !options.labels) {
    throw new ValidationError('At least one update field must be provided');
  }

  // Load config and merge with command line options
  const config = loadConfig(cmdArgsToConfig(globalOpts));

  // Create GitHub client
  const client = GitHubClient.fromConfig(config);

  // Prepare API options
  const apiOptions: Record<string, any> = {};

  // Add update fields if provided
  if (options.title) apiOptions.title = options.title;
  if (options.body) apiOptions.body = options.body;
  if (options.state) {
    if (!['open', 'closed'].includes(options.state)) {
      throw new ValidationError('State must be one of: open, closed');
    }
    apiOptions.state = options.state;
  }
  if (options.assignees) apiOptions.assignees = options.assignees.split(',').map((a: string) => a.trim());
  if (options.labels) apiOptions.labels = options.labels.split(',').map((l: string) => l.trim());

  // Optional extra information in verbose mode
  if (verbose) {
    console.log(`Updating issue #${issueId} in ${config.github.owner}/${config.github.repo}`);
    console.log(`Options: ${JSON.stringify(apiOptions)}`);
  }

  // Update issue
  const issue = await client.updateIssue(issueId, apiOptions);

  // Print results
  console.log(formatOutput(issue, formatType));
}
