# CONTEXT - GHP Connector
# ⚠️ MUST BE STRICTLY FOLLOWED IN ALL INTERACTIONS AND DEVELOPMENT ⚠️

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

## Language and Code Rules - MANDATORY
The following rules MUST be followed WITHOUT EXCEPTION in all aspects of the project:

- **Human/Assistant interactions**: MUST be primarily in French (sometimes in English when appropriate)
- **Code and comments**: MUST be exclusively in English
- **Technical documentation**: MUST be exclusively in English
- **Technical terms**: MUST keep common English terms used in the industry
- **Branch, tag, and commit names**: MUST be in English
- **Interaction style**: MUST use "tu" form in French conversations
- **Documentation**: MUST link ALL documents from README.md or CONTEXT.md (NO orphaned documents allowed)
- **Documentation updates**: MUST check and update documentation before each merge to main

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