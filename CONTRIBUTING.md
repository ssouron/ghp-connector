# Contributing to GHP Connector

Thank you for your interest in contributing to the GHP Connector project! This document provides guidelines for contributing to the project.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
- [Code Style Requirements](#code-style-requirements)
- [Testing Requirements](#testing-requirements)
- [Submission Process](#submission-process)

## Code of Conduct

This project and all its participants are governed by a code of conduct that promotes an open and welcoming environment. By participating, you agree to uphold this code.

## How Can I Contribute?

### Reporting Bugs

- Use the bug template to create a report
- Include detailed steps to reproduce the bug
- Mention your environment (OS, Node.js version, etc.)
- If possible, include a minimal reproducible example

### Feature Suggestions

- Use the feature template for suggestions
- Clearly describe the problem solved by the feature
- Consider how the feature fits into the existing architecture

### Pull Requests

- Create a branch from `main` for your changes
- Follow branch naming conventions
- Include tests for new features
- Update documentation if necessary

## Code Style Requirements

- Respect the project's ESLint and Prettier configuration
- Use descriptive names for variables and functions
- Write comments for complex code
- Follow recommended TypeScript practices (explicit types, etc.)

### Linting and Formatting

#### ESLint
- Run `npm run lint` before committing code
- Fix all ESLint errors and warnings
- ESLint configuration is in `.eslintrc.js`

#### Prettier
- All code must be formatted with Prettier
- Run `npm run format` to format all files
- Run `npm run format:check` to verify formatting
- Prettier configuration is in `.prettierrc`
- CI pipeline will verify formatting on all supported Node.js versions
- Formatting settings include:
  - Single quotes
  - 2 spaces indentation
  - 100 characters line width
  - Trailing commas for ES5 compatibility

## Testing Requirements

### General Rules for Tests

1. **Mandatory**: All new modules MUST be accompanied by tests
2. **Mandatory**: Changes to existing code MUST maintain or improve test coverage
3. **Mandatory**: Tests MUST be isolated and not depend on local configurations

### Test Structure

- **Location**: Tests MUST be placed in the same directory as the file being tested
- **Naming**: Test files MUST follow the format `<filename>.spec.ts`
- **Organization**: Tests MUST use Jest's `describe`/`it` pattern

### Code Coverage

- **Minimum threshold**: Coverage MUST be at least 80% for lines, branches, functions, and statements
- **Verification**: Run `npm run test:coverage:check` before submitting your PR
- **Reports**: Check the `coverage/` directory for detailed reports

### Mocks and Stubs

- **External dependencies**: MUST be mocked to isolate tests
- **File system**: Use the mocks provided in `src/lib/test-helpers/mocks/fs-mock.ts`
- **GitHub API**: Use the mocks provided in `src/lib/test-helpers/mocks/octokit-mock.ts`
- **Environment variables**: Use the mocks provided in `src/lib/test-helpers/mocks/env-mock.ts`

### Assertions

- Use specific assertions (prefer `toBe` over `toBeTruthy`)
- Test edge cases and error scenarios
- For complex objects, use `toEqual` or `expect.objectContaining`

### Resources

- Check [the complete testing guide](./docs/testing/guide.md) for more details
- For code coverage, see [the coverage documentation](./docs/testing/code-coverage.md)
- For advanced mocks, see [the mocks documentation](./docs/testing/advanced-mocks.md)

## Submission Process

1. Verify that your code follows the project's styles and conventions
2. Run the tests locally (`npm test`)
3. Check code coverage (`npm run test:coverage:check`)
4. Submit your Pull Request with a clear description
5. Wait for code review and respond to comments

Thank you for contributing to GHP Connector! 