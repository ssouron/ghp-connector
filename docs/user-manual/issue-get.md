# GitHub Projects Connector - Issue Get Command

This document provides detailed information about using the `ghp issue get` command to retrieve and display GitHub issue details from the command line.

## Overview

The `issue get` command allows you to fetch detailed information about a specific GitHub issue, including its status, assignees, labels, and optionally its comments. This is useful for quickly checking issue details without having to open the GitHub web interface.

## Basic Usage

```bash
ghp issue get 123
```

This retrieves and displays the details of issue #123 from your configured repository.

## Options

The `issue get` command supports the following options:

| Option            | Description                          | Default |
| ----------------- | ------------------------------------ | ------- |
| `--with-comments` | Include issue comments in the output | `false` |

### Global Formatting Options

In addition to the command-specific options, you can use these global formatting options:

| Option              | Description                                                             | Default        |
| ------------------- | ----------------------------------------------------------------------- | -------------- |
| `--format <format>` | Output format: `json`, `text`, `human`, `csv`, `table`, `minimal`       | `human`        |
| `--pretty`          | Format JSON output with indentation (only applies to `json` format)     | -              |
| `--indent <spaces>` | Number of spaces for indentation (only applies when `--pretty` is used) | `2`            |
| `--no-color`        | Disable color in terminal output                                        | -              |
| `--timezone <tz>`   | Timezone for date formatting (e.g., `America/New_York`)                 | System default |
| `--verbose`         | Show additional information during command execution                    | -              |

## Examples

### Get basic issue details

```bash
ghp issue get 123
```

### Get issue details including comments

```bash
ghp issue get 123 --with-comments
```

### Get issue details in JSON format

```bash
ghp issue get 123 --format=json
```

### Get issue details in JSON format with pretty printing

```bash
ghp issue get 123 --format=json --pretty
```

### Get issue details with a specific timezone

```bash
ghp issue get 123 --timezone="America/New_York"
```

### Save issue details to a file

```bash
ghp issue get 123 --format=json > issue-123.json
```

## Output Format

The command outputs detailed information about the issue, including:

- Issue number and title
- Status (open/closed)
- GitHub URL
- Creation and last update dates
- Creator information
- Labels
- Assignees
- Milestone (if any)
- Comment count
- Full issue description
- Issue comments (if `--with-comments` is used)

## Error Handling

The command includes error handling for common scenarios:

- Non-existent issues
- Rate limit exceeded
- Network connectivity issues
- Authentication errors
- Repository not found or insufficient permissions

## Tips and Best Practices

- Use `--with-comments` when you need to see the discussion context of an issue
- Use `--format=json` for programmatic access or to save issue data for later processing
- Use `--format=human` for the most readable terminal output
- For large issues with many comments, consider piping the output to a pager: `ghp issue get 123 --with-comments | less`
- When sharing issue details with others, consider using the JSON format to preserve all data

## Further Reading

- [Issue List Command](./issue-list.md) - Listing and filtering GitHub issues
- [Output Formatting Guide](../formatting/usage-guide.md)
- [Configuration Guide](../configuration.md)
- [Authentication Guide](../authentication.md)
