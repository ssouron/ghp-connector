# CONTEXT - GHP Connector

## Project Overview
GHP Connector is an open-source Node.js library for interacting with GitHub Issues and Projects via the command line. It is written in TypeScript, compiled to JavaScript, and published as an npm package.

## Current Project Status
- npm project initialization (version 0.0.1)
- MIT License
- Basic project structure in place
- Initial specifications documented

## Main Objectives
- Provide a simple command-line interface to interact with GitHub
- Alternative to curl commands for users and AI agents
- Initial focus on GitHub issues-related functionalities

## Important Technical Specifications
- Project uses TypeScript
- Installable as an npm package (globally or locally)
- Default parameters (repo, project) are provided by a configuration file
- Secrets (GitHub token, API keys) are provided via environment variables
- No need to specify the repo in each command (--repo)

## Project Structure
- `/src` - TypeScript source code
- `/dist` - Compiled JavaScript code (generated)
- `/docs` - Documentation
- `/bin` - Executable scripts

## Configuration
- Configuration via local file (e.g. `.ghprc.json`)
- Environment variables for secrets (GITHUB_TOKEN, GITHUB_API_KEY)

## Planned Commands
Format: `ghp [resource] [action] [options]`

Examples:
```
ghp issue list
ghp issue create --title="New bug" --body="Bug description"
ghp issue update --id=123 --status="closed"
```

## Development Notes
- Do not reimplement --repo arguments in commands
- Maintain a simple and intuitive interface
- Plan for formatted outputs for terminal and integration with other tools

## Language and Code Rules
- **Human/Assistant interactions**: primarily in French (sometimes in English)
- **Code and comments**: exclusively in English
- **Technical documentation**: exclusively in English
- **Technical terms**: keep common English terms used in the industry
- **Branch, tag, and commit names**: in English
- **Interaction style**: "tu" form in French conversations
- **Documentation**: all documents must be linked from README.md or CONTEXT.md (no orphaned documents)
- **Documentation updates**: check and update documentation before each merge to main

## Commit and Branch Standards
- **Commit format**: Conventional Commits (https://www.conventionalcommits.org/)
  - Structure: `<type>[optional scope]: <description>`
  - Main types: feat, fix, docs, style, refactor, test, chore
  - Example: `feat(issues): add list command implementation`
- **Branch names**:
  - Features: `feature/short-description`
  - Fixes: `fix/issue-description`
  - Documentation: `docs/what-is-changing`
  - Refactoring: `refactor/component-name`

## Work Methodology
- Regular validation during complex implementations
- Explanation and validation of solutions before implementation
- No Pull Requests (single developer) - proceed with merges with merge commits
- Reasonable review size

## Next Steps
- Implement core functionalities for issue management
- Set up configuration mechanisms
- Develop CLI interface

## Discussion Points
- Detailed command structure
- Input/output data format
- Testing strategy

## Project Documentation
- [README.md](./README.md) - Main project documentation
- [docs/initial-specs.md](./docs/initial-specs.md) - Initial specifications 