/**
 * GitHub API Client
 * Wrapper around Octokit to provide a simplified interface
 */

import { Octokit } from 'octokit';
import { GHPConfig } from '../config';

interface GitHubClientOptions {
  /**
   * GitHub API token
   */
  token?: string;

  /**
   * Repository owner
   */
  owner?: string;

  /**
   * Repository name
   */
  repo?: string;

  /**
   * Base URL for GitHub API (for GitHub Enterprise)
   */
  baseUrl?: string;
}

/**
 * GitHub API client wrapper
 */
export class GitHubClient {
  private octokit: Octokit;
  private owner: string | null;
  private repo: string | null;

  /**
   * Create a new GitHub client
   */
  constructor(options: GitHubClientOptions = {}) {
    // Initialize Octokit
    this.octokit = new Octokit({
      auth: options.token,
      baseUrl: options.baseUrl,
    });

    this.owner = options.owner || null;
    this.repo = options.repo || null;
  }

  /**
   * Initialize GitHub client from config
   */
  static fromConfig(config: GHPConfig): GitHubClient {
    return new GitHubClient({
      token: config.github.token,
      owner: config.github.owner,
      repo: config.github.repo,
    });
  }

  /**
   * Get repository information
   */
  async getRepository(owner?: string, repo?: string): Promise<any> {
    const repoOwner = owner || this.owner;
    const repoName = repo || this.repo;

    if (!repoOwner || !repoName) {
      throw new Error(
        'Repository owner and name are required. Provide them as parameters or set them in the configuration.'
      );
    }

    const { data } = await this.octokit.rest.repos.get({
      owner: repoOwner,
      repo: repoName,
    });

    return data;
  }

  /**
   * List issues in a repository
   */
  async listIssues(options: any = {}): Promise<any[]> {
    const repoOwner = options.owner || this.owner;
    const repoName = options.repo || this.repo;

    if (!repoOwner || !repoName) {
      throw new Error(
        'Repository owner and name are required. Provide them as parameters or set them in the configuration.'
      );
    }

    // Remove owner and repo from options and keep the rest
    const { owner: _owner, repo: _repo, ...restOptions } = options;

    const { data } = await this.octokit.rest.issues.listForRepo({
      owner: repoOwner,
      repo: repoName,
      ...restOptions,
    });

    return data;
  }

  /**
   * Get a single issue
   */
  async getIssue(issueNumber: number, options: any = {}): Promise<any> {
    const repoOwner = options.owner || this.owner;
    const repoName = options.repo || this.repo;

    if (!repoOwner || !repoName) {
      throw new Error(
        'Repository owner and name are required. Provide them as parameters or set them in the configuration.'
      );
    }

    const { data } = await this.octokit.rest.issues.get({
      owner: repoOwner,
      repo: repoName,
      issue_number: issueNumber,
    });

    return data;
  }

  /**
   * Get comments for an issue
   * @param issueNumber The issue number
   * @param options Additional options
   * @returns Array of comment objects
   */
  async getIssueComments(issueNumber: number, options: any = {}): Promise<any[]> {
    const repoOwner = options.owner || this.owner;
    const repoName = options.repo || this.repo;

    if (!repoOwner || !repoName) {
      throw new Error(
        'Repository owner and name are required. Provide them as parameters or set them in the configuration.'
      );
    }

    // Define pagination and sorting options
    const apiOptions = {
      owner: repoOwner,
      repo: repoName,
      issue_number: issueNumber,
      per_page: options.per_page || 100,
      sort: options.sort || 'created',
      direction: options.direction || 'asc',
    };

    const { data } = await this.octokit.rest.issues.listComments(apiOptions);
    return data;
  }

  /**
   * Create a new issue
   * Accepts either an options object with all parameters or separate parameters
   * @param titleOrOptions - Either the issue title as string or an options object containing title and other parameters
   * @param body - Optional issue body (only used if first parameter is a string)
   * @param options - Optional additional options (only used if first parameter is a string)
   */
  async createIssue(titleOrOptions: string | Record<string, any>, body?: string, options: any = {}): Promise<any> {
    let issueOptions: Record<string, any>;

    if (typeof titleOrOptions === 'string') {
      // Legacy signature: createIssue(title, body, options)
      issueOptions = {
        title: titleOrOptions,
        body,
        ...options,
      };
    } else {
      // New signature: createIssue(options)
      issueOptions = titleOrOptions;
    }

    const repoOwner = issueOptions.owner || this.owner;
    const repoName = issueOptions.repo || this.repo;

    if (!repoOwner || !repoName) {
      throw new Error(
        'Repository owner and name are required. Provide them as parameters or set them in the configuration.'
      );
    }

    // Validate that title is present
    if (!issueOptions.title) {
      throw new Error('Issue title is required');
    }

    // Remove owner and repo from options and keep the rest
    const { owner: _owner, repo: _repo, ...restOptions } = issueOptions;

    const { data } = await this.octokit.rest.issues.create({
      owner: repoOwner,
      repo: repoName,
      title: issueOptions.title, // Ensure title is explicitly included
      ...restOptions,
    });

    return data;
  }

  /**
   * Update an existing issue
   */
  async updateIssue(issueNumber: number, options: any = {}): Promise<any> {
    const repoOwner = options.owner || this.owner;
    const repoName = options.repo || this.repo;

    if (!repoOwner || !repoName) {
      throw new Error(
        'Repository owner and name are required. Provide them as parameters or set them in the configuration.'
      );
    }

    // Remove owner and repo from options and keep the rest
    const { owner: _owner, repo: _repo, ...restOptions } = options;

    const { data } = await this.octokit.rest.issues.update({
      owner: repoOwner,
      repo: repoName,
      issue_number: issueNumber,
      ...restOptions,
    });

    return data;
  }

  /**
   * Execute a GraphQL query against the GitHub API
   */
  async graphql(query: string, variables: any = {}): Promise<any> {
    return this.octokit.graphql(query, variables);
  }
}
