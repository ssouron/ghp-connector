/**
 * Text formatter implementation
 * Provides formatting for GitHub data in a human-readable text format
 */

import { BaseFormatter, FormatType, FormatterRuntimeOptions } from '../../base';
import { TextFormatterOptions } from './types';
import { formatIssue, formatPullRequest, formatRepository, formatUser } from './helpers';
import { colorize } from './colors';

/**
 * Text formatter implementation
 * Formats data as human-readable text
 */
export class TextFormatter extends BaseFormatter {
  /**
   * Configuration options
   */
  private options: TextFormatterOptions = {
    useColors: true,
    dateFormat: 'local',
    timezone: 'local',
    indentSize: 2,
    detailed: false,
  };

  /**
   * Create a new text formatter
   * @param options Formatter options
   */
  constructor(options?: Partial<TextFormatterOptions>) {
    super('text');
    if (options) {
      this.configure(options);
    }
  }

  /**
   * Configure the formatter with specific options
   * @param options Options to configure
   */
  configure(options: Partial<TextFormatterOptions>): void {
    this.options = { ...this.options, ...options };
  }

  /**
   * Format data into a string representation
   * @param data The data to format
   * @param runtimeOptions Optional runtime formatting options
   * @returns Formatted string
   */
  format(data: any, runtimeOptions?: FormatterRuntimeOptions): string {
    // Fusionner les options de configuration avec les options d'exécution
    const mergedOptions = {
      ...this.options,
      ...(runtimeOptions || {}),
    };

    // Utiliser temporairement les options fusionnées
    const originalOptions = { ...this.options };
    this.options = mergedOptions;

    let result = '';

    try {
      if (data === null || data === undefined) {
        result = '';
      } else if (typeof data === 'string') {
        result = data;
      } else if (typeof data === 'number' || typeof data === 'boolean') {
        result = String(data);
      } else if (Array.isArray(data)) {
        result = this.formatArray(data);
      } else {
        result = this.formatObject(data);
      }
    } finally {
      // Restaurer les options originales
      this.options = originalOptions;
    }

    return result;
  }

  /**
   * Format an array of data
   * @param arr Array to format
   * @returns Formatted string
   */
  private formatArray(arr: any[]): string {
    if (arr.length === 0) {
      return 'No items.';
    }

    // Check if this is an array of GitHub entities
    if (this.isIssueArray(arr)) {
      return this.formatIssueArray(arr);
    }

    if (this.isPullRequestArray(arr)) {
      return this.formatPullRequestArray(arr);
    }

    if (this.isRepositoryArray(arr)) {
      return this.formatRepositoryArray(arr);
    }

    if (this.isUserArray(arr)) {
      return this.formatUserArray(arr);
    }

    // Default array formatting
    return arr
      .map((item, index) => {
        const formatted = this.format(item);
        const lines = formatted.split('\n');

        // Add item number for multi-line items
        if (lines.length > 1) {
          lines[0] = `${index + 1}. ${lines[0]}`;
          return lines.join('\n');
        }

        return `${index + 1}. ${formatted}`;
      })
      .join('\n\n');
  }

  /**
   * Format an object
   * @param obj Object to format
   * @returns Formatted string
   */
  private formatObject(obj: Record<string, any>): string {
    // Detect and format specific GitHub entities
    if (this.isIssue(obj)) {
      return formatIssue(
        obj,
        0,
        this.options.useColors,
        this.options.detailed,
        this.options.dateFormat,
        this.options.timezone
      );
    }

    if (this.isPullRequest(obj)) {
      return formatPullRequest(
        obj,
        0,
        this.options.useColors,
        this.options.detailed,
        this.options.dateFormat,
        this.options.timezone
      );
    }

    if (this.isRepository(obj)) {
      return formatRepository(obj, 0, this.options.useColors, this.options.detailed);
    }

    if (this.isUser(obj)) {
      return formatUser(obj, 0, this.options.useColors, this.options.detailed);
    }

    // Default object formatting for other types
    const indent = ' '.repeat(this.options.indentSize || 2);
    const useColors = this.options.useColors ?? true;

    return Object.entries(obj)
      .filter(([, value]) => value !== null && value !== undefined)
      .map(([key, value]) => {
        const formattedKey = useColors ? colorize(`${key}:`, 'key', useColors) : `${key}:`;

        if (typeof value === 'object' && value !== null) {
          const nestedFormatted = this.format(value);
          if (nestedFormatted.includes('\n')) {
            return `${formattedKey}\n${this.indentLines(nestedFormatted, indent)}`;
          }
          return `${formattedKey} ${nestedFormatted}`;
        }

        return `${formattedKey} ${value}`;
      })
      .join('\n');
  }

  /**
   * Add indentation to all lines of text
   * @param text Text to indent
   * @param indent Indentation string
   * @returns Indented text
   */
  private indentLines(text: string, indent: string): string {
    return text
      .split('\n')
      .map((line) => `${indent}${line}`)
      .join('\n');
  }

  /**
   * Check if the object is a GitHub issue
   * @param obj Object to check
   * @returns True if the object is an issue
   */
  private isIssue(obj: any): boolean {
    return (
      obj &&
      typeof obj === 'object' &&
      'number' in obj &&
      'title' in obj &&
      'state' in obj &&
      !('head' in obj && 'base' in obj) // Ensure it's not a PR
    );
  }

  /**
   * Check if the object is a GitHub pull request
   * @param obj Object to check
   * @returns True if the object is a pull request
   */
  private isPullRequest(obj: any): boolean {
    return obj && typeof obj === 'object' && 'number' in obj && 'title' in obj && 'head' in obj && 'base' in obj;
  }

  /**
   * Check if the object is a GitHub repository
   * @param obj Object to check
   * @returns True if the object is a repository
   */
  private isRepository(obj: any): boolean {
    return (
      obj && typeof obj === 'object' && ('full_name' in obj || ('name' in obj && 'owner' in obj)) && 'html_url' in obj
    );
  }

  /**
   * Check if the object is a GitHub user
   * @param obj Object to check
   * @returns True if the object is a user
   */
  private isUser(obj: any): boolean {
    return (
      obj &&
      typeof obj === 'object' &&
      'login' in obj &&
      'html_url' in obj &&
      !('full_name' in obj) && // Not a repo
      !('title' in obj) // Not an issue or PR
    );
  }

  /**
   * Check if the array contains GitHub issues
   * @param arr Array to check
   * @returns True if the array contains issues
   */
  private isIssueArray(arr: any[]): boolean {
    return arr.length > 0 && this.isIssue(arr[0]);
  }

  /**
   * Check if the array contains GitHub pull requests
   * @param arr Array to check
   * @returns True if the array contains pull requests
   */
  private isPullRequestArray(arr: any[]): boolean {
    return arr.length > 0 && this.isPullRequest(arr[0]);
  }

  /**
   * Check if the array contains GitHub repositories
   * @param arr Array to check
   * @returns True if the array contains repositories
   */
  private isRepositoryArray(arr: any[]): boolean {
    return arr.length > 0 && this.isRepository(arr[0]);
  }

  /**
   * Check if the array contains GitHub users
   * @param arr Array to check
   * @returns True if the array contains users
   */
  private isUserArray(arr: any[]): boolean {
    return arr.length > 0 && this.isUser(arr[0]);
  }

  /**
   * Format an array of issues
   * @param issues Issues array
   * @returns Formatted string
   */
  private formatIssueArray(issues: any[]): string {
    if (issues.length === 0) {
      return 'No issues found.';
    }

    const count = issues.length;
    const countText = this.options.useColors
      ? colorize(`Found ${count} issue${count !== 1 ? 's' : ''}:`, 'header', true)
      : `Found ${count} issue${count !== 1 ? 's' : ''}:`;

    return [
      countText,
      ...issues.map((issue) =>
        formatIssue(
          issue,
          this.options.indentSize || 2,
          this.options.useColors,
          this.options.detailed,
          this.options.dateFormat,
          this.options.timezone
        )
      ),
    ].join('\n\n');
  }

  /**
   * Format an array of pull requests
   * @param prs Pull requests array
   * @returns Formatted string
   */
  private formatPullRequestArray(prs: any[]): string {
    if (prs.length === 0) {
      return 'No pull requests found.';
    }

    const count = prs.length;
    const countText = this.options.useColors
      ? colorize(`Found ${count} pull request${count !== 1 ? 's' : ''}:`, 'header', true)
      : `Found ${count} pull request${count !== 1 ? 's' : ''}:`;

    return [
      countText,
      ...prs.map((pr) =>
        formatPullRequest(
          pr,
          this.options.indentSize || 2,
          this.options.useColors,
          this.options.detailed,
          this.options.dateFormat,
          this.options.timezone
        )
      ),
    ].join('\n\n');
  }

  /**
   * Format an array of repositories
   * @param repos Repositories array
   * @returns Formatted string
   */
  private formatRepositoryArray(repos: any[]): string {
    if (repos.length === 0) {
      return 'No repositories found.';
    }

    const count = repos.length;
    const countText = this.options.useColors
      ? colorize(`Found ${count} repositor${count !== 1 ? 'ies' : 'y'}:`, 'header', true)
      : `Found ${count} repositor${count !== 1 ? 'ies' : 'y'}:`;

    return [
      countText,
      ...repos.map((repo) =>
        formatRepository(repo, this.options.indentSize || 2, this.options.useColors, this.options.detailed)
      ),
    ].join('\n\n');
  }

  /**
   * Format an array of users
   * @param users Users array
   * @returns Formatted string
   */
  private formatUserArray(users: any[]): string {
    if (users.length === 0) {
      return 'No users found.';
    }

    const count = users.length;
    const countText = this.options.useColors
      ? colorize(`Found ${count} user${count !== 1 ? 's' : ''}:`, 'header', true)
      : `Found ${count} user${count !== 1 ? 's' : ''}:`;

    return [
      countText,
      ...users.map((user) =>
        formatUser(user, this.options.indentSize || 2, this.options.useColors, this.options.detailed)
      ),
    ].join('\n\n');
  }

  /**
   * Get the supported format types
   * @returns Array of supported format types
   */
  getSupportedFormats(): FormatType[] {
    return ['text', 'minimal'];
  }
}
