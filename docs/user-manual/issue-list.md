# GitHub Projects Connector - Issue List Command

This document provides detailed information about using the `ghp issue list` command to view and filter GitHub issues from the command line.

## Overview

The `issue list` command allows you to fetch issues from a GitHub repository with powerful filtering, sorting, and formatting options. This command is useful for quickly checking the status of issues without visiting the GitHub web interface.

## Basic Usage

```bash
ghp issue list
```

By default, this will list the 10 most recent open issues in the configured repository.

## Options

The `issue list` command supports the following options:

| Option                    | Shorthand | Description                                                   | Default   |
| ------------------------- | --------- | ------------------------------------------------------------- | --------- |
| `--state <state>`         | `-s`      | Filter issues by state: `open`, `closed`, or `all`            | `open`    |
| `--limit <limit>`         | `-l`      | Maximum number of issues to return (1-100)                    | `10`      |
| `--assignee <assignee>`   | `-a`      | Filter issues assigned to a specific user                     | -         |
| `--label <labels>`        | `-L`      | Filter issues by label(s), comma-separated                    | -         |
| `--sort <sort>`           | `-S`      | Sort issues by: `created`, `updated`, or `comments`           | `created` |
| `--direction <direction>` | `-d`      | Sort direction: `asc` or `desc`                               | `desc`    |
| `--milestone <milestone>` | `-m`      | Filter by milestone number or "none"                          | -         |
| `--creator <creator>`     | `-c`      | Filter by the creator of the issue                            | -         |
| `--mentioned <mentioned>` | `-M`      | Filter by user mentioned in the issue                         | -         |
| `--since <date>`          | -         | Filter by issues updated since a given date (ISO 8601 format) | -         |

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

### List open issues

```bash
ghp issue list
```

### List closed issues

```bash
ghp issue list --state=closed
```

### List all issues (both open and closed)

```bash
ghp issue list --state=all
```

### List issues with a specific label

```bash
ghp issue list --label=bug
```

### List issues with multiple labels

```bash
ghp issue list --label="bug,enhancement,documentation"
```

### List issues assigned to a specific user

```bash
ghp issue list --assignee=username
```

### Limit the number of issues displayed

```bash
ghp issue list --limit=5
```

### Sort issues by most recently updated

```bash
ghp issue list --sort=updated
```

### Sort issues by most commented

```bash
ghp issue list --sort=comments
```

### Sort issues in ascending order (oldest first)

```bash
ghp issue list --direction=asc
```

### Filter issues by milestone

```bash
ghp issue list --milestone=1
```

### Filter issues with no milestone

```bash
ghp issue list --milestone=none
```

### Filter issues created by a specific user

```bash
ghp issue list --creator=username
```

### Filter issues that mention a specific user

```bash
ghp issue list --mentioned=username
```

### Filter issues updated since a specific date

```bash
ghp issue list --since=2023-01-01T00:00:00Z
```

### Combine multiple filters

```bash
ghp issue list --state=open --label=bug --assignee=username --limit=20
```

## Output Formatting

### JSON output (machine-readable)

```bash
ghp issue list --format=json
```

### Pretty-printed JSON with custom indentation

```bash
ghp issue list --format=json --pretty --indent=4
```

### Plain text output

```bash
ghp issue list --format=text
```

### Human-readable output without colors

```bash
ghp issue list --format=human --no-color
```

### Save issue list to a file

```bash
ghp issue list --format=json > issues.json
```

### Table output

```bash
ghp issue list --format=table
```

### Minimal output (just issue numbers and titles)

```bash
ghp issue list --format=minimal
```

### CSV output for spreadsheet import

```bash
ghp issue list --format=csv > issues.csv
```

## Timezone Handling

When displaying dates, you can specify a timezone:

```bash
ghp issue list --timezone="America/New_York"
```

## Verbose Mode

For troubleshooting, you can use verbose mode:

```bash
ghp issue list --verbose
```

This will show additional information about the request being made to the GitHub API.

## Error Handling

The command includes error handling for common scenarios:

- Rate limit exceeded
- Network connectivity issues
- Authentication errors
- Repository not found or insufficient permissions

## Tips and Best Practices

- Use `--format=json` for programmatic access or piping to other tools
- Use `--format=human` for colorized, well-formatted terminal output
- When filtering by multiple criteria, the conditions are combined with AND logic
- The `--limit` option affects performance - use lower limits for faster response times
- For complex filtering needs, consider using multiple commands and piping through `grep` or `jq`
- For regular usage, configure default repository settings in your config file to avoid specifying them in each command

## Further Reading

- [Output Formatting Guide](../formatting/usage-guide.md)
- [Configuration Guide](../configuration.md)
- [Authentication Guide](../authentication.md)
