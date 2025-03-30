# GHP Connector

A Node.js command line library for interacting with GitHub Issues and Projects.

## 🚀 Project Status

This project is in active development. The current version is `0.1.0`.

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

## 🧪 Testing

GHP Connector follows comprehensive testing practices:

### Running Tests

```bash
# Standard tests
npm test

# Watch mode for development
npm run test:watch

# With code coverage report
npm run test:coverage
```

### Code Style and Formatting

```bash
# Check code style with ESLint
npm run lint

# Format code with Prettier
npm run format

# Check code formatting
npm run format:check
```

### Testing Structure

- Tests are located alongside their implementation files
- Test files follow the naming pattern `<filename>.spec.ts`
- All external dependencies are properly mocked
- Code coverage thresholds are set to 80%

### Test Documentation

Comprehensive test documentation is available:

- [Quick Start Testing Guide](./docs/testing/quick-start.md)
- [Complete Testing Guide](./docs/testing/guide.md)
- [Code Coverage Information](./docs/testing/code-coverage.md)
- [Advanced Mocking Strategies](./docs/testing/advanced-mocks.md)

For contributors, please ensure all new code includes appropriate tests as outlined in the [Contributing Guide](./CONTRIBUTING.md).

## 🗓️ Roadmap

The project roadmap is structured around the following milestones:

1. **Initial Setup**: Project setup, architecture, and configuration
2. **Issues CRUD**: Basic operations for GitHub Issues management

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