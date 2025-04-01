# GHP Connector Configuration

This document describes how to configure GHP Connector for your GitHub repositories and preferences.

## Configuration File

GHP Connector uses a configuration file named `.ghprc.json` to store default settings. This allows you to avoid specifying common parameters like repository information in every command.

### Location

The configuration file can be placed in:

1. **Project level**: `./.ghprc.json` in your current working directory
2. **User level**: `~/.ghprc.json` in your home directory

The project-level configuration takes precedence over the user-level configuration.

### Creating a Configuration File

You can create a new configuration file using the `config init` command:

```bash
# Create a configuration file in the current directory
ghp config init

# Create a global configuration file in your home directory
ghp config init --global
```

> **Important**: The `.ghprc.json` file is automatically ignored by git (added to `.gitignore`). This is a security measure to prevent accidentally committing sensitive information like tokens to the repository. Never commit this file to version control, even if it doesn't contain sensitive data, as it may contain project-specific settings that shouldn't be shared with other developers.

### Configuration Schema

The configuration file uses JSON format with the following structure:

```json
{
  "github": {
    "owner": "username",
    "repo": "repository-name",
    "baseUrl": "https://api.github.com"
  },
  "defaults": {
    "format": "human",
    "issues": {
      "state": "open",
      "limit": 10,
      "sort": "created",
      "direction": "desc"
    },
    "projects": {}
  }
}
```

#### GitHub Section

| Field     | Description                                   | Default                  |
| --------- | --------------------------------------------- | ------------------------ |
| `owner`   | GitHub username or organization               | (empty)                  |
| `repo`    | GitHub repository name                        | (empty)                  |
| `baseUrl` | GitHub API URL (useful for GitHub Enterprise) | `https://api.github.com` |

#### Defaults Section

| Field              | Description                                         | Default   |
| ------------------ | --------------------------------------------------- | --------- |
| `format`           | Output format (`human`, `json`, `table`, `minimal`) | `human`   |
| `issues.state`     | Default issue state filter                          | `open`    |
| `issues.limit`     | Default number of issues to fetch                   | `10`      |
| `issues.sort`      | Default sorting field                               | `created` |
| `issues.direction` | Default sorting direction                           | `desc`    |

## Environment Variables

For security reasons, sensitive information like authentication tokens should be provided through environment variables rather than in the configuration file.

Available environment variables:

| Variable         | Description                            |
| ---------------- | -------------------------------------- |
| `GITHUB_TOKEN`   | GitHub personal access token           |
| `GITHUB_OWNER`   | GitHub username or organization        |
| `GITHUB_REPO`    | GitHub repository name                 |
| `GITHUB_API_URL` | GitHub API URL (for GitHub Enterprise) |

Example:

```bash
# Set environment variables
export GITHUB_TOKEN="your-personal-access-token"
export GITHUB_OWNER="your-username"
export GITHUB_REPO="your-repository"

# Run command without specifying owner/repo
ghp issue list
```

## Configuration Precedence

When determining the final configuration, GHP Connector follows this precedence order (highest to lowest):

1. Command-line arguments (e.g., `--owner`, `--repo`)
2. Environment variables (e.g., `GITHUB_TOKEN`)
3. Project-level configuration file (`./.ghprc.json`)
4. User-level configuration file (`~/.ghprc.json`)
5. Default values

This allows you to:

- Use defaults for common operations
- Override specific settings temporarily on the command line
- Keep sensitive information in environment variables

## GitHub Token

For most operations, you'll need a GitHub personal access token with appropriate permissions. To create a token:

1. Go to [GitHub Settings > Developer settings > Personal access tokens](https://github.com/settings/tokens)
2. Click "Generate new token"
3. Select the following scopes:
   - `repo`: For repository access
   - `project`: For project board management (includes issues access)
4. Copy the token and store it securely
5. Set it as the `GITHUB_TOKEN` environment variable or use it with the `--token` option

## Examples

### Basic Configuration File

```json
{
  "github": {
    "owner": "username",
    "repo": "my-project"
  }
}
```

### Advanced Configuration

```json
{
  "github": {
    "owner": "myorg",
    "repo": "backend-api",
    "baseUrl": "https://github.mycompany.com/api/v3"
  },
  "defaults": {
    "format": "json",
    "issues": {
      "state": "all",
      "limit": 20,
      "sort": "updated",
      "direction": "asc"
    }
  }
}
```
