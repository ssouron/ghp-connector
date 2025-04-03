# CONTEXT - GHP Connector

# ⚠️ MUST BE STRICTLY FOLLOWED IN ALL INTERACTIONS AND DEVELOPMENT ⚠️

## Project Overview

GHP Connector is an open-source Node.js library for interacting with GitHub Issues and Projects via the command line. It is written in TypeScript, compiled to JavaScript, and published as an npm package.

## Current Project Status

- npm project initialization (version 0.2.0)
- MIT License
- Basic project structure in place
- Initial specifications documented
- Comprehensive testing infrastructure implemented
- CI/CD pipeline setup with GitHub Actions
- ESLint configuration for code quality
- Versioning follows Semantic Versioning (SemVer) - see https://semver.org/
- GitHub token validation system implemented
- Output formatting system architecture implemented with registry/factory pattern
- Core formatters (JSON, Text, Human) implemented
- Output formatting documentation available
- CLI integration for global formatting options (`--format`, `--pretty`, etc.) implemented (Issue #35)

## Main Objectives

- Provide a simple command-line interface to interact with GitHub
- Alternative to curl commands for users and AI agents
- Initial focus on GitHub issues-related functionalities
- Support for both human-readable and machine-readable outputs
- Enterprise-ready with proper security measures

## Important Technical Specifications

- Project uses TypeScript
- Installable as an npm package (globally or locally)
- Default parameters (repo, project) are provided by a configuration file
- Secrets (GitHub token, API keys) are provided via environment variables or configuration file
- No need to specify the repo in each command (--repo)
- Output formatting system with multiple format support
- Global CLI options control output format (`--format`) and format-specific settings (`--pretty`, `--indent`, `--no-color`, `--timezone`)
- Secure token handling with rotation support

## Project Structure

- `/src` - TypeScript source code
  - `/lib` - Core library code
    - `/formatters` - Output formatting system
    - `/config` - Configuration management
    - `/errors` - Error handling
    - `/test-helpers` - Testing utilities
  - `/cli` - Command-line interface
    - `/validation.ts` - CLI option validation logic
    - `/validation.spec.ts` - Tests for CLI validation
- `/dist` - Compiled JavaScript code (generated)
- `/docs` - Documentation
- `/bin` - Executable scripts

## Configuration

- Configuration via local file (e.g. `.ghprc.json`)
- Environment variables for secrets (GITHUB_TOKEN, GITHUB_API_KEY)
- Secrets can be provided via environment variables or configuration file
- Format-specific configuration options
- CLI options can override configuration file settings for formatting
- Enterprise configuration support

## Planned Commands

Format: `ghp [resource] [action] [options]`

Examples:

```
ghp issue list
ghp issue create --title="New bug" --body="Bug description"
ghp issue update --id=123 --status="closed"
ghp issue list --format=json --pretty --indent=4
ghp issue list --format=text --no-color
ghp issue list --format=human --timezone="America/Los_Angeles"
```

## Development Notes

- Do not reimplement --repo arguments in commands
- Maintain a simple and intuitive interface
- Plan for formatted outputs for terminal and integration with other tools
- Follow modular architecture for formatters
- Ensure proper error handling and validation
- Consider performance for large datasets

## Testing Conventions - MANDATORY

The following rules MUST be followed for all testing in the project:

- **Test location**: MUST be placed in the same directory as the file being tested
- **Test naming**: MUST follow the pattern `<filename>.spec.ts` (e.g., `issue.ts` -> `issue.spec.ts`)
- **Test structure**: MUST use Jest's describe/it pattern for organization
- **Test isolation**: MUST NOT depend on local system configurations
- **Test helpers**: Common test helpers MUST be placed in `src/lib/test-helpers`
- **Platform compatibility**: Tests MUST run correctly on Windows, Mac, and Linux
- **Mocking**: External dependencies SHOULD be mocked appropriately
- **Coverage**: Tests SHOULD aim for reasonable coverage of core functionality
- **Performance testing**: MUST include performance tests for large datasets

## Language and Code Rules - MANDATORY

The following rules MUST be followed WITHOUT EXCEPTION in all aspects of the project:

- **Human/Assistant interactions**: MUST be primarily in French (sometimes in English when appropriate)
- **Code and comments**: MUST be exclusively in English
- **Technical documentation**: MUST be exclusively in English (including ALL markdown files in the docs/ directory)
- **Technical terms**: MUST keep common English terms used in the industry
- **Branch, tag, and commit names**: MUST be in English
- **Interaction style**: MUST use "tu" form in French conversations
- **Documentation**: MUST link ALL documents from README.md or CONTEXT.md (NO orphaned documents allowed)
- **Documentation updates**: MUST check and update documentation before each merge to main

⚠️ **IMPORTANT: All documentation files (.md files) are considered technical documentation and MUST be written EXCLUSIVELY in English. This includes all files in the docs/ directory, README.md, CONTRIBUTING.md, etc. Only the conversational interactions between human and assistant can be in French.**

## Commit and Branch Standards - MANDATORY

- **Commit format**: MUST follow Conventional Commits (https://www.conventionalcommits.org/)
  - Structure: `<type>[optional scope]: <description>`
  - Main types: feat, fix, docs, style, refactor, test, chore
  - Example: `feat(issues): add list command implementation`
  - CRITICAL: Commit messages MUST ALWAYS be in English
- **Branch names**: MUST follow these patterns:
  - Features: `feature/short-description`
  - Fixes: `fix/issue-description`
  - Documentation: `docs/what-is-changing`
  - Refactoring: `refactor/component-name`

## Version Management - MANDATORY

- **Versioning standard**: Project MUST use Semantic Versioning (SemVer) as defined at https://semver.org/
  - Increment MAJOR version when making incompatible API changes
  - Increment MINOR version when adding functionality in a backward compatible manner
  - Increment PATCH version when making backward compatible bug fixes
- **Version change process**:
  1. Run `npm version <type>` (patch|minor|major)
  2. Update CHANGELOG.md with new version section
  3. Update README.md Project Status section
  4. Update CONTEXT.md Current Project Status section
  5. Create a conventional commit with message: `chore: bump version to <version>`
- **Version change locations**: When bumping version, ALL of these MUST be updated:
  - package.json (version field) - via npm version
  - CHANGELOG.md (add new version section)
  - README.md (Project Status section)
  - CONTEXT.md (Current Project Status section)
- **CHANGELOG format**: MUST follow Keep a Changelog format (https://keepachangelog.com/)
  - Group changes by type: Added, Changed, Deprecated, Removed, Fixed, Security
  - Every significant change MUST have an entry
  - Each version MUST be marked as RELEASED or UNRELEASED
  - Example:
    ```markdown
    ## [0.2.0] - 2024-04-01 [UNRELEASED]
    ```

## Work Methodology - MANDATORY

- ⚠️ **CRITICAL**: MUST ALWAYS explain planned approaches and get explicit approval BEFORE implementing ANY code
- MUST present a clear plan with detailed steps for each implementation task
- MUST present alternative technical approaches with pros and cons before choosing one
- MUST break down complex implementations into smaller, individually-approved steps
- MUST obtain explicit confirmation before proceeding to the next implementation step
- MUST NOT implement multiple components simultaneously without explicit approval
- MUST perform regular validation during complex implementations
- MUST proceed with merges with merge commits (No Pull Requests - single developer)
- MUST keep review size reasonable
- MUST create detailed sub-tasks for complex features
- MUST run ALL tests (unit, integration, performance) before marking a ticket as completed

## Current Development Focus

### Active Features

- Advanced formatting options (Issue #14)
  - CSV support
  - Custom templates
  - Advanced table formatting
  - File output support
- CLI Integration for Formatting Options (Issue #35) - In Progress / Partially Completed

### Upcoming Features

- GitHub Projects integration
- Issue filtering and searching
- Batch operations for issues
- Enterprise-specific features

### Completed Features

- GitHub token validation system
- Basic project structure
- Testing infrastructure
- CI/CD pipeline
- Output formatting core architecture (Issue #32)
  - Formatter interface and base class
  - Registry and factory system
  - Configuration system
  - Error handling
  - Core formatters (JSON, Text, Human)
  - Documentation
- JSON Formatter Implementation (Issue #34)
  - Pretty-print and compact options
  - Configurable indentation
  - Recursive key sorting
  - Circular reference handling
  - Comprehensive tests
- Core CLI integration for global formatting options (Issue #35)

## Technical Decisions Log

### Architecture Decisions

- **Formatter System**: Modular architecture with interface-based design
  - Allows easy addition of new formats
  - Maintains separation of concerns
  - Enables format-specific optimizations
- **Token Management**: In-memory storage with rotation support
  - Enhanced security
  - Reduced risk of token exposure
  - Support for enterprise requirements

### Implementation Notes

- **Test Command**: A temporary `test-format` command has been implemented for development and testing purposes
  - Should be removed when primary commands are fully implemented
  - Not intended for production use
  - Currently registered in src/cli.ts and exported in src/commands/index.ts
- **CLI Option Validation**: Validation logic for combinations of format-related CLI options (e.g., `--pretty` requires `--format=json`) is implemented in `src/cli/validation.ts`.
- **CLI Help Display**: Global options are defined on the main program but might not appear in the help text of subcommands due to `commander.js` behavior; this is accepted for simplicity.

### Technology Choices

- **TypeScript**: For type safety and better developer experience
- **Jest**: For comprehensive testing
- **Commander.js**: For CLI interface
- **Octokit**: For GitHub API interactions
- **Chalk**: For terminal color support

## Performance Considerations

### Known Limitations

- Large dataset handling in formatters
- Memory usage with large JSON responses
- Network latency in enterprise environments

### Optimization Strategies

- Lazy loading of formatters
- Streaming for large responses
- Caching of frequently accessed data
- Pagination support for large result sets

## Security Guidelines

### Token Management

- No token storage in files
- In-memory only storage
- Automatic token rotation
- Scope validation

### Data Handling

- No sensitive data in logs
- Secure error messages
- Input validation
- Output sanitization

## Development Environment

### Required Tools

- Node.js (v16 or higher)
- npm or yarn
- Git
- TypeScript compiler

### Recommended Tools

- VS Code with TypeScript support
- (or) Cursor IDE for Vibe Coding
- Jest test runner
- ESLint
- Prettier

### Environment Variables

```
GITHUB_TOKEN=your_token_here
GITHUB_API_KEY=your_api_key_here
NODE_ENV=development
```

## Common Issues and Solutions

### Known Issues

- Token validation failures in enterprise environments
- Performance degradation with large datasets
- Format switching overhead

### Workarounds

- Use pagination for large datasets
- Implement caching where appropriate
- Use appropriate format for use case

## Future Considerations

### Planned Improvements

- Webhook support
- Real-time updates
- Batch operations
- Custom formatter plugins

### Potential Challenges

- Enterprise proxy support
- Rate limiting handling
- Cross-platform compatibility
- Performance at scale

## Support and Maintenance

### Bug Reports

- Must use the bug report issue template
- Must include reproduction steps
- Must specify environment details
- Must provide error messages
- Must include relevant logs

### Feature Requests

- Must align with project goals
- Must include use case
- Must consider impact on existing features
- Must include implementation suggestions

## Release Process

### Pre-release Checklist

- Update version numbers
- Update CHANGELOG.md
- Run full test suite
- Check documentation
- Verify security measures
- Test in different environments

### Release Steps

1. Create release branch
2. Update version numbers
3. Update documentation
4. Run tests
5. Create release tag
6. Publish to npm
7. Update GitHub releases
8. Merge to main

## Contributing Guidelines

### Code Style

- Follow TypeScript best practices
- Follow Clean Code naming conventions:
  - Use descriptive and self-documenting names
  - Use verbs for functions/methods
  - Use nouns for classes/interfaces
  - Use boolean variables starting with is/has/should
  - Use consistent naming patterns across the codebase
- Follow SOLID principles:
  - Single Responsibility Principle
  - Open/Closed Principle
  - Liskov Substitution Principle
  - Interface Segregation Principle
  - Dependency Inversion Principle
- Follow DRY (Don't Repeat Yourself) principle
- Add JSDoc comments
- Keep functions focused
- Write unit tests

### Documentation Style

- Use clear, concise language in all documentation
- Include diagrams using Mermaid when useful for understanding complex systems, workflows, or architectures
- Provide usage examples for all major features
- Update documentation whenever the related code changes
- Structure documentation with appropriate headings and sections
- Use consistent formatting throughout documentation files

### Pull Request Process

- Create feature branch
- Write tests
- Update documentation
- Submit PR
- Address review comments
- Merge after approval

## Project Timeline

### Current Sprint

- Complete output formatting system
- Implement basic formatters
- Add CLI integration for formatting (options, validation) - Done
- Write documentation

### Next Sprint

- Implement advanced formatting
- Add CSV support
- Add template support
- Performance optimization

### Future Sprints

- Enterprise features
- Plugin system
- Performance improvements
- Additional integrations

## Project Documentation

- [README.md](./README.md) - Main project documentation
- [docs/initial-specs.md](./docs/initial-specs.md) - Initial specifications
- [docs/formatting/architecture.md](./docs/formatting/architecture.md) - Output formatting architecture
- [docs/formatting/usage-guide.md](./docs/formatting/usage-guide.md) - Output formatting usage guide
