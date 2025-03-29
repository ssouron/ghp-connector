# GHP Connector

A Node.js command line library for interacting with GitHub Issues and Projects.

## 🚀 Project Status

This project is in active development. The current version is `0.0.2`.

## 📚 About

GHP Connector is an open-source library that allows easy interaction with GitHub Issues and Projects directly from the command line. Written in TypeScript, it offers a simple and readable alternative to curl commands for users and AI agents.

## ✨ Features

- Complete GitHub Issues management (creation, reading, updating, deletion)
- User-friendly formatting of results for terminal display
- Simple and intuitive interface suitable for use by humans and AI agents
- Configuration system for default settings and repository information

## 🛠️ Installation

```bash
# Global installation
npm install -g ghp-connector

# Local installation
npm install --save-dev ghp-connector
```

## 📝 Usage

```bash
# List issues
ghp issue list

# Create an issue
ghp issue create --title "Bug report" --body "Description"

# Update an issue status
ghp issue update --id 123 --status closed

# Initialize a configuration file
ghp config init
```

## ⚙️ Configuration

GHP Connector can be configured using:

- Configuration files (local `.ghprc.json` or global `~/.ghprc.json`)
- Environment variables (for sensitive information like tokens)
- Command-line arguments (for overriding defaults)

This allows you to avoid typing the same options repeatedly.

For detailed configuration instructions, see the [Configuration Guide](./docs/configuration.md).

## 🏗️ Architecture

GHP Connector uses:
- **Commander.js** as the CLI framework
- **Octokit** as the GitHub API client

For more details on the architecture, see the [CLI Architecture documentation](./docs/cli-architecture.md).

## 🗓️ Roadmap

La feuille de route du projet s'articule autour des jalons suivants :

1. **Initial Setup**: Mise en place du projet, architecture et configuration
2. **Issues CRUD**: Opérations de base pour la gestion des Issues GitHub

## 📖 Documentation

For more details on usage and features, see the documentation files:

- [Initial Specifications](./docs/initial-specs.md)
- [CLI Architecture](./docs/cli-architecture.md)
- [Architecture Diagram](./docs/architecture-diagram.md)
- [Configuration Guide](./docs/configuration.md)
- [Code Coverage Reports](./docs/testing/code-coverage.md)

## 🤝 Contributing

Contributions are welcome! Feel free to open an issue or submit a pull request.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details. 