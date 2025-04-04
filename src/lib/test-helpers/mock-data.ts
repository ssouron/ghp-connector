/**
 * Mock Data Generators
 * Generate realistic mock data for formatter testing
 */

/**
 * Generate a mock GitHub issue
 * @param id Optional issue ID
 * @param options Custom issue properties
 * @returns Mock issue object
 */
export function generateMockIssue(id = 1, options: Partial<MockIssue> = {}): MockIssue {
  return {
    id,
    number: id,
    title: options.title || `Issue #${id} title`,
    body: options.body || `This is the body of issue #${id}. It can contain **Markdown** _formatting_.`,
    state: options.state || 'open',
    labels: options.labels || [
      { id: 1, name: 'bug', color: 'ff0000' },
      { id: 2, name: 'enhancement', color: '00ff00' },
    ],
    assignees: options.assignees || [
      { id: 101, login: 'user1', type: 'User' },
      { id: 102, login: 'user2', type: 'User' },
    ],
    comments: options.comments || 5,
    created_at: options.created_at || new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: options.updated_at || new Date().toISOString(),
    milestone: options.milestone || {
      id: 1,
      title: 'v1.0',
      description: 'Version 1.0 milestone',
      state: 'open',
    },
    url: options.url || `https://api.github.com/repos/owner/repo/issues/${id}`,
    html_url: options.html_url || `https://github.com/owner/repo/issues/${id}`,
  };
}

/**
 * Generate a collection of mock GitHub issues
 * @param count Number of issues to generate
 * @param baseOptions Base options to apply to all issues
 * @returns Array of mock issues
 */
export function generateMockIssues(count = 10, baseOptions: Partial<MockIssue> = {}): MockIssue[] {
  return Array.from({ length: count }, (_, i) => generateMockIssue(i + 1, baseOptions));
}

/**
 * Generate a mock GitHub project
 * @param id Optional project ID
 * @param options Custom project properties
 * @returns Mock project object
 */
export function generateMockProject(id = 1, options: Partial<MockProject> = {}): MockProject {
  return {
    id,
    number: id,
    name: options.name || `Project ${id}`,
    body: options.body || `Description of project ${id}`,
    state: options.state || 'open',
    created_at: options.created_at || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: options.updated_at || new Date().toISOString(),
    creator: options.creator || {
      id: 101,
      login: 'user1',
      type: 'User',
    },
    columns: options.columns || [
      { id: 1001, name: 'To Do', cards_url: 'https://api.github.com/projects/columns/1001/cards' },
      { id: 1002, name: 'In Progress', cards_url: 'https://api.github.com/projects/columns/1002/cards' },
      { id: 1003, name: 'Done', cards_url: 'https://api.github.com/projects/columns/1003/cards' },
    ],
  };
}

/**
 * Generate a large dataset for performance testing
 * @param size Size classification (small, medium, large, xlarge)
 * @returns Large dataset object
 */
export function generateLargeDataset(size: 'small' | 'medium' | 'large' | 'xlarge' = 'medium'): any {
  const counts = {
    small: { issues: 20, comments: 5, depth: 3 },
    medium: { issues: 100, comments: 10, depth: 5 },
    large: { issues: 500, comments: 20, depth: 7 },
    xlarge: { issues: 2000, comments: 50, depth: 10 },
  };

  const { issues: issueCount, comments: commentCount, depth } = counts[size];

  // Generate issues with nested comments
  const issues = Array.from({ length: issueCount }, (_, i) => {
    const issue = generateMockIssue(i + 1);

    // Add deep nested properties for testing serialization
    let nestedObj: any = {};
    let current = nestedObj;

    for (let d = 0; d < depth; d++) {
      current.level = `Level ${d}`;
      current.data = { value: `Value at depth ${d}` };
      current.next = {};
      current = current.next;
    }

    // Add comments to the issue
    issue.comments_data = Array.from({ length: commentCount }, (_, j) => ({
      id: i * 1000 + j,
      body: `Comment ${j} on issue #${i + 1}`,
      user: {
        id: 200 + j,
        login: `commenter${j}`,
        type: 'User',
      },
      created_at: new Date(Date.now() - j * 24 * 60 * 60 * 1000).toISOString(),
      nested: nestedObj,
    }));

    return issue;
  });

  return {
    repository: {
      id: 12345,
      name: 'test-repo',
      full_name: 'owner/test-repo',
      description: 'Test repository with a large dataset',
      owner: {
        id: 101,
        login: 'owner',
        type: 'Organization',
      },
    },
    issues: issues,
    stats: {
      total_issues: issueCount,
      open_issues: Math.floor(issueCount * 0.7),
      closed_issues: Math.floor(issueCount * 0.3),
      total_comments: issueCount * commentCount,
      average_comments_per_issue: commentCount,
    },
    meta: {
      generated_at: new Date().toISOString(),
      size_classification: size,
      version: '1.0',
    },
  };
}

/**
 * Generate a data structure with circular references
 * @returns Object with circular references
 */
export function generateCircularData(): any {
  const obj: any = {
    id: 1,
    name: 'Circular Object',
    simple_properties: {
      string: 'text value',
      number: 42,
      boolean: true,
      null_value: null,
    },
    array: [1, 2, 'three', { nested: 'value' }],
  };

  // Add circular references
  obj.self_reference = obj;
  obj.array.push(obj);
  obj.nested = { parent: obj, name: 'Nested Object' };
  obj.nested.self = obj.nested;

  return obj;
}

/**
 * Generate a data structure with special characters for encoding tests
 * @returns Object with special characters
 */
export function generateSpecialCharacters(): any {
  return {
    basic_latin: 'ABCDEabcde12345',
    whitespace: 'Line 1\nLine 2\tTabbed\r\nWindows',
    quotes: 'Single \' Double " Backtick `',
    html_entities: '< > & " \'',
    control_chars: '\u0000\u0001\u0002\u0003',
    unicode: 'こんにちは世界 你好世界 안녕하세요 мир',
    emojis: '😀 🚀 🔥 👍 🎉',
    escapes: '\\n \\t \\\\ \\/ \\b \\f \\r',
    json_special: '{ } [ ] , : "',
    numbers_special: '-0 +1 1e10 1.5e-10 NaN Infinity',
  };
}

// Add type definitions for mock data structures
export interface MockLabel {
  id: number;
  name: string;
  color: string;
}

export interface MockUser {
  id: number;
  login: string;
  type: string;
}

export interface MockMilestone {
  id: number;
  title: string;
  description: string;
  state: string;
}

export interface MockIssue {
  id: number;
  number: number;
  title: string;
  body: string;
  state: string;
  labels: MockLabel[];
  assignees: MockUser[];
  comments: number;
  comments_data?: any[];
  created_at: string;
  updated_at: string;
  milestone: MockMilestone;
  url: string;
  html_url: string;
}

export interface MockColumn {
  id: number;
  name: string;
  cards_url: string;
}

export interface MockProject {
  id: number;
  number: number;
  name: string;
  body: string;
  state: string;
  created_at: string;
  updated_at: string;
  creator: MockUser;
  columns: MockColumn[];
}
