# Changelog

All notable changes to GHP Connector will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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