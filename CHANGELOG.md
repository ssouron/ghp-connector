# Changelog

All notable changes to GHP Connector will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.5.0] - 2024-05-06

### Added

- Implemented enhanced `ghp issue get` command with comprehensive features:
  - Detailed issue display with title, body, status, labels, assignees, and dates
  - Support for retrieving and displaying issue comments with `--with-comments` flag
  - GitHub URL inclusion for easy browser access
  - Comment count and last activity display
  - Proper error handling for non-existent issues
- Added detailed documentation for `issue get` command in user manual
- Enhanced testing infrastructure for command testing
- Improved error messages for better user experience

### Improved

- Refined test organization for better maintainability
- Enhanced output formatting for issue details
- Added proper inheritance of formatting options to subcommands

## [0.4.0] - 2024-04-09

### Added

- Implemented enhanced `ghp issue list` command with comprehensive filtering options:
  - Filtering by state (open, closed, all)
  - Filtering by assignee, labels, creator, and mentioned users
  - Filtering by milestone
  - Filtering by creation/update date
  - Sorting by various criteria
- Added improved error handling for API limitations and network issues
- Enhanced documentation with detailed examples
- Support for JSON pretty-printing with configurable indentation
- Implemented appropriate handling for empty result sets

### Improved

- Enhanced format detection for better UX
- Refined help text with command examples
- Better argument validation for CLI options

## [0.3.1] - 2024-04-06

### Fixed

- Resolved issue with global CLI options not being displayed in commander.js help output (Issue #38)
- Consolidated CLI entry points to avoid command conflicts between files
- Added explicit help text for global options in both main help and subcommand help outputs

## [0.3.0] - 2024-04-05

### Added

- Implemented comprehensive output formatting architecture with modular design (Issue #13)
- Added support for multiple output formats:
  - Human-readable format optimized for terminal display (default)
  - JSON format for integration and automation
  - Text format for simple machine processing
- Implemented core formatters:
  - `JsonFormatter` with pretty-print, compact output, key sorting, and circular reference handling
  - `TextFormatter` with detailed output, color support, and date formatting
  - `HumanFormatter` extending TextFormatter with enhanced terminal features
- Added global CLI options for formatting:
  - `--format` to select output format
  - `--pretty` for JSON pretty-printing
  - `--indent` for JSON indentation control
  - `--no-color` to disable terminal colors
  - `--timezone` for date/time formatting
- Comprehensive formatter testing infrastructure with:
  - Mock data generators
  - Format-specific assertions
  - Performance measurement utilities
  - Test fixtures and cross-format validation tools
- Detailed documentation for the formatting system

### Changed

- Standardized output formatting across all commands
- Enhanced date/time formatting with timezone support
- Improved code organization with formatter registry and factory patterns
- Harmonized formatting system documentation

## [0.2.0] - 2024-04-01

### Added

- GitHub token validation system with:
  - Format validation (40-character hexadecimal string)
  - Scope validation (repo, project)
  - Rate limit status checking
  - Token rotation support
  - Secure memory handling
- New command `ghp token validate` for token validation
- Comprehensive documentation for token management and security
- Enterprise configuration validation with health checks

### Changed

- Updated configuration schema to include rate limiting settings
- Enhanced security documentation with OWASP compliance guidelines
- Improved error messages for token-related issues

### Security

- Implemented secure token storage in memory
- Added token rotation mechanism
- Enhanced error handling for sensitive data
- Added audit logging for security events

## [0.1.0] - 2023-05-10

### Added

- ESLint configuration with TypeScript support
- CI/CD pipeline configuration with GitHub Actions
- Support for multiple Node.js versions in CI pipeline
- Linting rules for better code quality

### Fixed

- Unused variables across the codebase
- Pipeline failures in GitHub Actions
- Improper handling of Jest cache in Git

## [0.0.3] - 2023-04-05

### Added

- Comprehensive testing infrastructure with Jest
  - Implementation of unit tests for core modules:
    - Configuration module (src/lib/config/)
    - Error handling module (src/lib/errors/)
    - Formatters module (src/lib/formatters/)
  - Test helpers and utilities in src/lib/test-helpers/
  - Mocks for external dependencies (fs, GitHub API, environment variables)
  - Code coverage reports with 80% minimum threshold for tested modules
  - Cross-platform compatible test suite (Windows, Mac, Linux)
- Test documentation:
  - Testing guide (docs/testing/guide.md)
  - Code coverage information (docs/testing/code-coverage.md)
  - Advanced mocking strategies (docs/testing/advanced-mocks.md)
- New npm scripts for testing:
  - `test`: Run all tests
  - `test:watch`: Run tests in watch mode
  - `test:coverage`: Generate coverage reports
  - `test:coverage:check`: Verify coverage thresholds
  - `ci:test`: Run tests in CI environment

## [0.0.2] - 2023-03-29

### Added

- Configuration file system with support for:
  - Local configuration file (`./.ghprc.json`)
  - Global configuration file (`~/.ghprc.json`)
  - Environment variables for sensitive information
  - Command-line overrides
- Configuration initialization command (`ghp config init`)
- Comprehensive configuration documentation
- GitHub Enterprise support via `baseUrl` configuration

## [0.0.1] - 2023-03-29

### Added

- Initial project setup with TypeScript configuration
- CLI architecture based on Commander.js
- GitHub API client using Octokit
- Configuration management system with support for:
  - Local config files (.ghprc.json)
  - Environment variables
  - Command line arguments
- Error handling framework with custom error types and exit codes
- Output formatting system with support for multiple formats:
  - Human-readable format (default)
  - JSON format
  - Table format
  - Minimal format for scripting
- Command structure following `ghp <resource> <action> [options]` pattern
- Basic implementation of issue-related commands:
  - `issue list`: List GitHub issues
  - `issue get`: Get details of a specific issue
  - `issue create`: Create a new issue
  - `issue update`: Update an existing issue
- Comprehensive documentation:
  - CLI architecture documentation
  - Architecture diagrams using Mermaid
  - Command structure and naming conventions
  - Configuration management approach

## [UNRELEASED]

### Added

### Changed

### Deprecated

### Removed

### Fixed

### Security
