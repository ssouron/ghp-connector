/**
 * Mock GitHub API
 * Provides mock implementation of GitHub API responses for testing
 */

/**
 * Create a mock GitHub issue
 * @param id Issue ID
 * @param title Issue title
 * @param options Additional options
 * @returns A mock GitHub issue object
 */
export function createMockIssue(id: number, title: string, options: Partial<MockIssueOptions> = {}) {
  const now = new Date().toISOString();

  return {
    id,
    number: id,
    title,
    body: options.body || 'Test issue body',
    state: options.state || 'open',
    html_url: `https://github.com/test-owner/test-repo/issues/${id}`,
    labels: options.labels || [],
    assignees: options.assignees || [],
    created_at: options.created_at || now,
    updated_at: options.updated_at || now,
    closed_at: options.state === 'closed' ? options.closed_at || now : null,
    user: {
      login: options.creator || 'test-user',
      id: 1,
      avatar_url: 'https://github.com/test-user.png',
      html_url: 'https://github.com/test-user',
    },
  };
}

/**
 * Create a list of mock issues
 * @param count Number of issues to create
 * @param options Additional options
 * @returns An array of mock GitHub issues
 */
export function createMockIssueList(count: number, options: Partial<MockIssueOptions> = {}) {
  return Array.from({ length: count }, (_, i) => createMockIssue(i + 1, `Test issue ${i + 1}`, options));
}

/**
 * Options for creating mock issues
 */
export interface MockIssueOptions {
  body: string;
  state: 'open' | 'closed';
  labels: Array<{ id: number; name: string; color: string }>;
  assignees: Array<{ login: string; id: number }>;
  created_at: string;
  updated_at: string;
  closed_at: string | null;
  creator: string;
}
