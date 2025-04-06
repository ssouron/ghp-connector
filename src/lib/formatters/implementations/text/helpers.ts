/**
 * Helper functions for text formatting
 * Provides utilities for formatting different types of data
 */

import { colorize, formatStatus } from './colors';

/**
 * Format a date with the specified format and timezone
 * @param date Date to format (string or Date object)
 * @param format Format to use ('ISO', 'local', 'relative')
 * @param timezone Timezone to use
 * @param useColors Whether to use colors
 * @returns Formatted date string
 */
export function formatDate(
  date: string | Date,
  format: 'ISO' | 'local' | 'relative' = 'local',
  timezone = 'local',
  useColors = true
): string {
  if (!date) {
    return '';
  }

  const dateObj = typeof date === 'string' ? new Date(date) : date;

  // Apply timezone if specified and not 'local'
  let formattedDate = '';

  switch (format) {
    case 'ISO':
      formattedDate = dateObj.toISOString();
      break;
    case 'relative':
      formattedDate = getRelativeTime(dateObj);
      break;
    case 'local':
    default:
      if (timezone === 'local') {
        formattedDate = dateObj.toLocaleString();
      } else {
        formattedDate = dateObj.toLocaleString('en-US', { timeZone: timezone });
      }
      break;
  }

  return useColors ? colorize(formattedDate, 'date', useColors) : formattedDate;
}

/**
 * Get relative time from a date compared to now
 * @param date Date to compare
 * @returns Relative time string (e.g., "2 hours ago")
 */
function getRelativeTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.round(diffMs / 1000);
  const diffMin = Math.round(diffSec / 60);
  const diffHour = Math.round(diffMin / 60);
  const diffDay = Math.round(diffHour / 24);
  const diffMonth = Math.round(diffDay / 30);
  const diffYear = Math.round(diffDay / 365);

  if (diffSec < 60) {
    return `${diffSec} second${diffSec !== 1 ? 's' : ''} ago`;
  }
  if (diffMin < 60) {
    return `${diffMin} minute${diffMin !== 1 ? 's' : ''} ago`;
  }
  if (diffHour < 24) {
    return `${diffHour} hour${diffHour !== 1 ? 's' : ''} ago`;
  }
  if (diffDay < 30) {
    return `${diffDay} day${diffDay !== 1 ? 's' : ''} ago`;
  }
  if (diffMonth < 12) {
    return `${diffMonth} month${diffMonth !== 1 ? 's' : ''} ago`;
  }
  return `${diffYear} year${diffYear !== 1 ? 's' : ''} ago`;
}

/**
 * Format an issue object
 * @param issue Issue data
 * @param indentation Indentation level
 * @param useColors Whether to use colors
 * @param detailed Whether to include detailed information
 * @param dateFormat Date format to use
 * @param timezone Timezone to use
 * @param showComments Whether to display comments
 * @returns Formatted issue string
 */
export function formatIssue(
  issue: any,
  indentation = 0,
  useColors = true,
  detailed = false,
  dateFormat: 'ISO' | 'local' | 'relative' = 'local',
  timezone = 'local',
  showComments = false
): string {
  if (!issue) {
    return '';
  }

  const indent = ' '.repeat(indentation);
  const lines: string[] = [];

  // Title with issue number
  const title = `Issue #${issue.number}: ${issue.title}`;
  lines.push(`${indent}${useColors ? colorize(title, 'header', useColors) : title}`);

  // Status
  if (issue.state) {
    const statusLabel = `${indent}Status: `;
    const status = formatStatus(issue.state, useColors);
    lines.push(`${statusLabel}${status}`);
  }

  // GitHub URL
  if (issue.html_url) {
    const urlLabel = `${indent}URL: `;
    const url = useColors ? colorize(issue.html_url, 'url', useColors) : issue.html_url;
    lines.push(`${urlLabel}${url}`);
  }

  // Creation date
  if (issue.created_at) {
    const dateLabel = `${indent}Created: `;
    const date = formatDate(issue.created_at, dateFormat, timezone, useColors);
    lines.push(`${dateLabel}${date}`);
  }

  // Updated date (last activity)
  if (issue.updated_at) {
    const dateLabel = `${indent}Last updated: `;
    const date = formatDate(issue.updated_at, dateFormat, timezone, useColors);
    lines.push(`${dateLabel}${date}`);
  }

  // Creator
  if (issue.user) {
    const creatorLabel = `${indent}Created by: `;
    const creator = useColors ? colorize(issue.user.login, 'value', useColors) : issue.user.login;
    lines.push(`${creatorLabel}${creator}`);
  }

  // Labels
  if (issue.labels && issue.labels.length > 0) {
    const labelsStr = issue.labels.map((label: any) => label.name).join(', ');
    const labelsLabel = `${indent}Labels: `;
    lines.push(`${labelsLabel}${useColors ? colorize(labelsStr, 'value', useColors) : labelsStr}`);
  }

  // Assignees
  if (issue.assignees && issue.assignees.length > 0) {
    const assigneesStr = issue.assignees.map((user: any) => user.login).join(', ');
    const assigneesLabel = `${indent}Assignees: `;
    lines.push(`${assigneesLabel}${useColors ? colorize(assigneesStr, 'value', useColors) : assigneesStr}`);
  }

  // Milestone
  if (issue.milestone) {
    const milestoneLabel = `${indent}Milestone: `;
    const milestone = useColors ? colorize(issue.milestone.title, 'value', useColors) : issue.milestone.title;
    lines.push(`${milestoneLabel}${milestone}`);
  }

  // Comment count
  if (issue.comments !== undefined) {
    const commentsLabel = `${indent}Comments: `;
    const commentsCount = useColors
      ? colorize(issue.comments.toString(), 'value', useColors)
      : issue.comments.toString();
    lines.push(`${commentsLabel}${commentsCount}`);
  }

  // Add body if detailed view is requested
  if (detailed && issue.body) {
    lines.push(''); // Empty line for separation
    lines.push(`${indent}${useColors ? colorize('Description:', 'section', useColors) : 'Description:'}`);
    lines.push(`${indent}${issue.body}`);
  }

  // Add comments if available and requested
  if (showComments && issue.comments_data && issue.comments_data.length > 0) {
    lines.push(''); // Empty line for separation
    lines.push(`${indent}${useColors ? colorize('Comments:', 'section', useColors) : 'Comments:'}`);

    issue.comments_data.forEach((comment: any, index: number) => {
      if (index > 0) {
        lines.push(''); // Add separation between comments
      }

      // Comment header with author and date
      const commentHeader = `${indent}  ${comment.user.login} commented ${formatDate(comment.created_at, dateFormat, timezone, useColors)}:`;
      lines.push(`${useColors ? colorize(commentHeader, 'header2', useColors) : commentHeader}`);

      // Comment body with indentation
      if (comment.body) {
        const bodyLines = comment.body.split('\n');
        bodyLines.forEach((line: string) => {
          lines.push(`${indent}    ${line}`);
        });
      }
    });
  }

  return lines.join('\n');
}

/**
 * Format a pull request object
 * @param pr Pull request data
 * @param indentation Indentation level
 * @param useColors Whether to use colors
 * @param detailed Whether to include detailed information
 * @param dateFormat Date format to use
 * @param timezone Timezone to use
 * @returns Formatted pull request string
 */
export function formatPullRequest(
  pr: any,
  indentation = 0,
  useColors = true,
  detailed = false,
  dateFormat: 'ISO' | 'local' | 'relative' = 'local',
  timezone = 'local'
): string {
  if (!pr) {
    return '';
  }

  const indent = ' '.repeat(indentation);
  const lines: string[] = [];

  // Title with PR number
  const title = `PR #${pr.number}: ${pr.title}`;
  lines.push(`${indent}${useColors ? colorize(title, 'header', useColors) : title}`);

  // Status
  if (pr.state) {
    const statusLabel = `${indent}Status: `;
    const status = formatStatus(pr.state, useColors);
    lines.push(`${statusLabel}${status}`);
  }

  // Branch information
  if (pr.head && pr.base) {
    const branchInfo = `${pr.head.ref} → ${pr.base.ref}`;
    const branchLabel = `${indent}Branch: `;
    lines.push(`${branchLabel}${useColors ? colorize(branchInfo, 'value', useColors) : branchInfo}`);
  }

  // Creation date
  if (pr.created_at) {
    const dateLabel = `${indent}Created: `;
    const date = formatDate(pr.created_at, dateFormat, timezone, useColors);
    lines.push(`${dateLabel}${date}`);
  }

  // Labels
  if (pr.labels && pr.labels.length > 0) {
    const labelsStr = pr.labels.map((label: any) => label.name).join(', ');
    const labelsLabel = `${indent}Labels: `;
    lines.push(`${labelsLabel}${useColors ? colorize(labelsStr, 'value', useColors) : labelsStr}`);
  }

  // Add body if detailed view is requested
  if (detailed && pr.body) {
    lines.push(''); // Empty line for separation
    lines.push(`${indent}${pr.body}`);
  }

  return lines.join('\n');
}

/**
 * Format a repository object
 * @param repo Repository data
 * @param indentation Indentation level
 * @param useColors Whether to use colors
 * @param detailed Whether to include detailed information
 * @returns Formatted repository string
 */
export function formatRepository(repo: any, indentation = 0, useColors = true, detailed = false): string {
  if (!repo) {
    return '';
  }

  const indent = ' '.repeat(indentation);
  const lines: string[] = [];

  // Repository name with owner
  const fullName = repo.full_name || `${repo.owner?.login || 'unknown'}/${repo.name || 'unknown'}`;
  const title = `Repository: ${fullName}`;
  lines.push(`${indent}${useColors ? colorize(title, 'header', useColors) : title}`);

  // Description
  if (repo.description) {
    lines.push(`${indent}Description: ${repo.description}`);
  }

  // Visibility
  if (repo.private !== undefined) {
    const visibility = repo.private ? 'private' : 'public';
    lines.push(`${indent}Visibility: ${formatStatus(visibility, useColors)}`);
  }

  // URL
  if (repo.html_url) {
    lines.push(`${indent}URL: ${useColors ? colorize(repo.html_url, 'url', useColors) : repo.html_url}`);
  }

  // Add detailed information if requested
  if (detailed) {
    if (repo.language) {
      lines.push(`${indent}Language: ${repo.language}`);
    }

    if (repo.default_branch) {
      lines.push(`${indent}Default branch: ${repo.default_branch}`);
    }

    if (repo.stargazers_count !== undefined) {
      lines.push(`${indent}Stars: ${repo.stargazers_count}`);
    }

    if (repo.forks_count !== undefined) {
      lines.push(`${indent}Forks: ${repo.forks_count}`);
    }

    if (repo.open_issues_count !== undefined) {
      lines.push(`${indent}Open issues: ${repo.open_issues_count}`);
    }
  }

  return lines.join('\n');
}

/**
 * Format a user object
 * @param user User data
 * @param indentation Indentation level
 * @param useColors Whether to use colors
 * @param detailed Whether to include detailed information
 * @returns Formatted user string
 */
export function formatUser(user: any, indentation = 0, useColors = true, detailed = false): string {
  if (!user) {
    return '';
  }

  const indent = ' '.repeat(indentation);
  const lines: string[] = [];

  // User name with login
  const displayName = user.name || user.login || 'Unknown User';
  const title = `User: ${displayName}`;
  lines.push(`${indent}${useColors ? colorize(title, 'header', useColors) : title}`);

  // Login if different from name
  if (user.name && user.login && user.name !== user.login) {
    lines.push(`${indent}Login: ${user.login}`);
  }

  // URL
  if (user.html_url) {
    lines.push(`${indent}URL: ${useColors ? colorize(user.html_url, 'url', useColors) : user.html_url}`);
  }

  // Add detailed information if requested
  if (detailed) {
    if (user.bio) {
      lines.push(`${indent}Bio: ${user.bio}`);
    }

    if (user.company) {
      lines.push(`${indent}Company: ${user.company}`);
    }

    if (user.location) {
      lines.push(`${indent}Location: ${user.location}`);
    }

    if (user.email) {
      lines.push(`${indent}Email: ${user.email}`);
    }

    if (user.public_repos !== undefined) {
      lines.push(`${indent}Public repositories: ${user.public_repos}`);
    }

    if (user.followers !== undefined) {
      lines.push(`${indent}Followers: ${user.followers}`);
    }
  }

  return lines.join('\n');
}
