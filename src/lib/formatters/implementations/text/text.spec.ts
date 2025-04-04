/**
 * Tests for the text formatter
 */

import { TextFormatter } from './TextFormatter';
import { colorize, formatStatus } from './colors';
import { formatDate, formatIssue, formatPullRequest, formatRepository, formatUser } from './helpers';

// Mock chalk to avoid color output in tests
jest.mock('chalk', () => {
  const originalChalk = jest.requireActual('chalk');
  // Create a proxy that adds markers around colorized text for testing
  return {
    ...originalChalk,
    blue: jest.fn((text) => `[blue]${text}[/blue]`),
    cyan: jest.fn((text) => `[cyan]${text}[/cyan]`),
    white: jest.fn((text) => `[white]${text}[/white]`),
    yellow: jest.fn((text) => `[yellow]${text}[/yellow]`),
    green: jest.fn((text) => `[green]${text}[/green]`),
    red: jest.fn((text) => `[red]${text}[/red]`),
  };
});

describe('Text Formatter', () => {
  let formatter: TextFormatter;

  beforeEach(() => {
    formatter = new TextFormatter();
  });

  describe('Basic Functionality', () => {
    it('should format basic strings', () => {
      expect(formatter.format('test')).toBe('test');
    });

    it('should handle null and undefined', () => {
      expect(formatter.format(null)).toBe('');
      expect(formatter.format(undefined)).toBe('');
    });

    it('should format simple objects', () => {
      const result = formatter.format({ name: 'test', value: 123 });
      expect(result).toContain('[cyan]name:[/cyan]');
      expect(result).toContain('[cyan]value:[/cyan] 123');
    });

    it('should format simple arrays', () => {
      const result = formatter.format(['one', 'two', 'three']);
      expect(result).toContain('1. one');
      expect(result).toContain('2. two');
      expect(result).toContain('3. three');
    });
  });

  describe('Configuration', () => {
    it('should apply configuration options', () => {
      formatter = new TextFormatter({
        useColors: false,
        dateFormat: 'ISO',
        timezone: 'UTC',
        indentSize: 4,
        detailed: true,
      });

      // Access private options field for testing
      // @ts-expect-error - Accessing private field for testing
      expect(formatter.options.useColors).toBe(false);
      // @ts-expect-error - Accessing private field for testing
      expect(formatter.options.dateFormat).toBe('ISO');
      // @ts-expect-error - Accessing private field for testing
      expect(formatter.options.timezone).toBe('UTC');
      // @ts-expect-error - Accessing private field for testing
      expect(formatter.options.indentSize).toBe(4);
      // @ts-expect-error - Accessing private field for testing
      expect(formatter.options.detailed).toBe(true);
    });

    it('should update configuration with configure method', () => {
      formatter.configure({ useColors: false });

      // @ts-expect-error - Accessing private field for testing
      expect(formatter.options.useColors).toBe(false);
      // Other options should remain unchanged
      // @ts-expect-error - Accessing private field for testing
      expect(formatter.options.dateFormat).toBe('local');
    });
  });

  describe('GitHub Entities Formatting', () => {
    it('should format an issue', () => {
      const issue = {
        number: 123,
        title: 'Test Issue',
        state: 'open',
        created_at: '2023-01-01T00:00:00Z',
        labels: [{ name: 'bug' }, { name: 'high-priority' }],
        body: 'This is a test issue',
      };

      const result = formatter.format(issue);
      expect(result).toContain('Issue #123');
      expect(result).toContain('Test Issue');
      expect(result).toContain('Status:');
      expect(result).toContain('Labels:');
      expect(result).not.toContain('This is a test issue'); // Not detailed by default
    });

    it('should format a pull request', () => {
      const pr = {
        number: 456,
        title: 'Test PR',
        state: 'open',
        created_at: '2023-01-01T00:00:00Z',
        head: { ref: 'feature-branch' },
        base: { ref: 'main' },
        body: 'This is a test PR',
      };

      const result = formatter.format(pr);
      expect(result).toContain('PR #456');
      expect(result).toContain('Test PR');
      expect(result).toContain('Status:');
      expect(result).toContain('Branch:');
      expect(result).toContain('feature-branch');
      expect(result).toContain('main');
      expect(result).not.toContain('This is a test PR'); // Not detailed by default
    });

    it('should format a repository', () => {
      const repo = {
        full_name: 'owner/repo',
        name: 'repo',
        owner: { login: 'owner' },
        html_url: 'https://github.com/owner/repo',
        description: 'A test repository',
        private: false,
      };

      const result = formatter.format(repo);
      expect(result).toContain('Repository: owner/repo');
      expect(result).toContain('Description: A test repository');
      expect(result).toContain('Visibility:');
      expect(result).toContain('URL:');
    });

    it('should format a user', () => {
      const user = {
        login: 'testuser',
        name: 'Test User',
        html_url: 'https://github.com/testuser',
        bio: 'A test user',
        location: 'Test City',
      };

      const result = formatter.format(user);
      expect(result).toContain('User: Test User');
      expect(result).toContain('Login: testuser');
      expect(result).toContain('URL:');
      expect(result).not.toContain('Bio:'); // Not detailed by default
    });
  });

  describe('Color Support', () => {
    it('should use colors by default', () => {
      const result = formatter.format({ name: 'test' });
      expect(result).toContain('[cyan]');
    });

    it('should not use colors when disabled', () => {
      formatter = new TextFormatter({ useColors: false });
      const result = formatter.format({ name: 'test' });
      expect(result).not.toContain('[cyan]');
    });
  });

  describe('Detail Level', () => {
    it('should show additional details when detailed is true', () => {
      formatter = new TextFormatter({ detailed: true });
      const issue = {
        number: 123,
        title: 'Test Issue',
        state: 'open',
        body: 'This is the detailed description',
      };

      const result = formatter.format(issue);
      expect(result).toContain('This is the detailed description');
    });
  });

  describe('Array Formatting', () => {
    it('should format an array of issues', () => {
      const issues = [
        { number: 1, title: 'Issue 1', state: 'open' },
        { number: 2, title: 'Issue 2', state: 'closed' },
      ];

      const result = formatter.format(issues);
      expect(result).toContain('Found 2 issues:');
      expect(result).toContain('Issue #1');
      expect(result).toContain('Issue #2');
    });

    it('should format an array of pull requests', () => {
      const prs = [
        {
          number: 1,
          title: 'PR 1',
          state: 'open',
          head: { ref: 'branch1' },
          base: { ref: 'main' },
        },
        {
          number: 2,
          title: 'PR 2',
          state: 'closed',
          head: { ref: 'branch2' },
          base: { ref: 'main' },
        },
      ];

      const result = formatter.format(prs);
      expect(result).toContain('Found 2 pull requests:');
      expect(result).toContain('PR #1');
      expect(result).toContain('PR #2');
    });

    it('should handle empty arrays', () => {
      expect(formatter.format([])).toBe('No items.');
    });
  });
});

describe('Helper Functions', () => {
  describe('Color Functions', () => {
    it('should colorize text', () => {
      expect(colorize('test', 'header')).toContain('[blue]test[/blue]');
      expect(colorize('test', 'key')).toContain('[cyan]test[/cyan]');
    });

    it('should handle status colors', () => {
      expect(formatStatus('open')).toContain('[green]open[/green]');
      expect(formatStatus('closed')).toContain('[red]closed[/red]');
      expect(formatStatus('pending')).toContain('[yellow]pending[/yellow]');
      expect(formatStatus('unknown')).toContain('[blue]unknown[/blue]');
    });

    it('should not add color when disabled', () => {
      expect(colorize('test', 'header', false)).toBe('test');
      expect(formatStatus('open', false)).toBe('open');
    });
  });

  describe('Date Formatting', () => {
    const testDate = new Date('2023-01-01T12:00:00Z');

    it('should format dates in different formats', () => {
      expect(formatDate(testDate, 'ISO')).toContain('2023-01-01T12:00:00.000Z');
      expect(formatDate(testDate, 'relative')).toMatch(/\d+ (day|month|year)s? ago/);
    });

    it('should accept string dates', () => {
      expect(formatDate('2023-01-01T12:00:00Z', 'ISO')).toContain('2023-01-01T12:00:00.000Z');
    });

    it('should handle empty dates', () => {
      expect(formatDate('', 'ISO')).toBe('');
      expect(formatDate(null as any, 'ISO')).toBe('');
    });
  });

  describe('Entity Formatting', () => {
    it('should format issues with all options', () => {
      const issue = {
        number: 123,
        title: 'Test Issue',
        state: 'open',
        created_at: '2023-01-01T00:00:00Z',
        labels: [{ name: 'bug' }],
        body: 'Description',
      };

      const formatted = formatIssue(issue, 2, true, true, 'ISO', 'UTC');
      expect(formatted).toContain('[blue]Issue #123');
      expect(formatted).toContain('Status:');
      expect(formatted).toContain('Created:');
      expect(formatted).toContain('Labels:');
      expect(formatted).toContain('Description');
    });

    it('should format pull requests', () => {
      const pr = {
        number: 456,
        title: 'Test PR',
        state: 'open',
        created_at: '2023-01-01T00:00:00Z',
        head: { ref: 'feature' },
        base: { ref: 'main' },
      };

      const formatted = formatPullRequest(pr, 0, true, false, 'local', 'local');
      expect(formatted).toContain('PR #456');
      expect(formatted).toContain('[white]feature → main[/white]');
    });

    it('should format repositories', () => {
      const repo = {
        full_name: 'owner/repo',
        html_url: 'https://github.com/owner/repo',
        description: 'A test repo',
        private: true,
      };

      const formatted = formatRepository(repo, 0, true, true);
      expect(formatted).toContain('Repository: owner/repo');
      expect(formatted).toContain('private');
    });

    it('should format users', () => {
      const user = {
        login: 'testuser',
        name: 'Test User',
        html_url: 'https://github.com/testuser',
        bio: 'A developer',
      };

      const formatted = formatUser(user, 0, true, true);
      expect(formatted).toContain('User: Test User');
      expect(formatted).toContain('Bio: A developer');
    });
  });
});
