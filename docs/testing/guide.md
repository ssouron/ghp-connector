# Testing Guide for GHP Connector

This guide provides comprehensive information on the GHP Connector testing system for current and future developers.

## Table of Contents
- [Quick Start Guide](./quick-start.md)
- [Running Tests](#running-tests)
- [Adding New Tests](#adding-new-tests)
- [Best Practices for Assertions and Mocks](#best-practices-for-assertions-and-mocks)
- [Quality and Coverage Criteria](#quality-and-coverage-criteria)

## Running Tests

### Prerequisites
- Node.js (version ≥ 14.0.0)
- npm or yarn

### Test Commands

#### Standard Tests
To run all tests once:
```bash
npm test
```

#### Watch Mode
To run tests continuously and watch for changes:
```bash
npm run test:watch
```
This mode is particularly useful during active development as it automatically runs affected tests when you modify files.

#### Tests with Code Coverage
To run tests and generate a code coverage report:
```bash
npm run test:coverage
```

This report will be available in the `coverage/` directory and includes:
- A summary in the terminal
- A detailed HTML report in `coverage/lcov-report/index.html`
- Report files in lcov and clover formats for CI/CD integration

#### Coverage Verification
To check if your code meets the defined coverage thresholds:
```bash
npm run test:coverage:check
```

This command will fail if coverage is below the thresholds defined in `jest.config.js` (currently 80% for tested modules).

#### Tests in CI Environment
```bash
npm run ci:test
```

This command is used by continuous integration and generates coverage reports adapted to CI environments.

## Adding New Tests

### Test Structure

GHP Connector uses a "side-by-side" test structure where test files are placed next to the files they test. For example:

```
src/lib/config/
  ├── index.ts         # Source code
  └── index.spec.ts    # Tests for index.ts
```

### Naming Conventions

- Test files MUST follow the format `<filename>.spec.ts`
- Test helper files MUST be placed in `src/lib/test-helpers/`

### Creating a New Test

1. Create a test file next to the file you want to test:
   ```typescript
   // src/lib/example/index.spec.ts
   
   import { myFunction } from './index';
   
   describe('myFunction', () => {
     it('should do something specific', () => {
       // Arrangement (prepare test data)
       const input = 'test';
       
       // Action (execute the function being tested)
       const result = myFunction(input);
       
       // Assertion (verify the result)
       expect(result).toBe('expected output');
     });
   });
   ```

2. Use the `describe`/`it` structure to organize your tests:
   - `describe` to group related tests (typically by function or class)
   - `it` to describe a specific behavior to test

3. Follow the AAA (Arrange-Act-Assert) pattern:
   - **Arrange**: Prepare test data and conditions
   - **Act**: Execute the code being tested
   - **Assert**: Verify that the result matches expectations

### Using Test Helpers

The project has reusable test utilities in `src/lib/test-helpers/`:

```typescript
import { 
  createTempTestDir,
  createTempTestFile,
  cleanupTestFiles
} from '../test-helpers/test-utils';

describe('My module', () => {
  const tempPaths = [];
  
  afterEach(() => {
    // Cleanup after each test
    cleanupTestFiles(...tempPaths);
    tempPaths.length = 0;
  });
  
  it('should read a file correctly', () => {
    // Create a temporary file for the test
    const content = '{"key":"value"}';
    const filePath = createTempTestFile(content);
    tempPaths.push(filePath);
    
    // Test...
  });
});
```

## Best Practices for Assertions and Mocks

### Assertions

GHP Connector uses Jest for assertions. Here are some best practices:

1. **Be specific**: Use the most precise assertion possible
   ```typescript
   // ❌ Too general
   expect(result).toBeTruthy();
   
   // ✅ More specific
   expect(result).toBe('expected value');
   ```

2. **Test exceptions**: Check that errors are thrown correctly
   ```typescript
   expect(() => {
     functionThatThrows();
   }).toThrow('Expected error message');
   ```

3. **Check complete structures**: Use `toEqual` to compare objects
   ```typescript
   expect(result).toEqual({
     id: 123,
     name: 'test',
     active: true
   });
   ```

4. **Partial assertions**: Use `expect.objectContaining` for partial checks
   ```typescript
   expect(result).toEqual(expect.objectContaining({
     id: 123
     // Other fields are not checked
   }));
   ```

### Mocks

The project provides specific mock utilities in `src/lib/test-helpers/mocks/`:

1. **File system mocks**:
   ```typescript
   import { mockFs, mockVirtualFs } from '../test-helpers/mocks/fs-mock';
   
   it('should read a file', () => {
     // Create a virtual file system
     const { fs: fsMock, restore } = mockVirtualFs({
       '/config.json': '{"key":"value"}'
     });
     
     // Use the mock in the test
     const result = functionThatReadsFiles('/config.json');
     expect(result).toEqual({ key: 'value' });
     
     // Restore original behavior
     restore();
   });
   ```

2. **GitHub API (Octokit) mocks**:
   ```typescript
   import { mockOctokit } from '../test-helpers/mocks/octokit-mock';
   
   it('should retrieve issues', async () => {
     // Create a GitHub API mock
     const octokit = mockOctokit({
       customResponses: {
         issues: {
           list: [
             { id: 1, title: 'Issue 1' },
             { id: 2, title: 'Issue 2' }
           ]
         }
       }
     });
     
     // Inject the mock into the code being tested
     const result = await functionThatUsesOctokit(octokit);
     expect(result.length).toBe(2);
   });
   ```

3. **Environment variable mocks**:
   ```typescript
   import { mockEnv } from '../test-helpers/mocks/env-mock';
   
   it('should use the GitHub token', () => {
     // Mock environment variables
     const restore = mockEnv({
       GITHUB_TOKEN: 'fake-token-123'
     });
     
     try {
       const result = functionThatUsesEnvVars();
       expect(result.token).toBe('fake-token-123');
     } finally {
       // Important: restore the environment
       restore();
     }
   });
   ```

4. **Function mocks with Jest**:
   ```typescript
   it('should call the callback function', () => {
     // Create a function mock
     const callback = jest.fn();
     
     // Use the mock
     functionThatCallsCallback(callback);
     
     // Verify that the function was called
     expect(callback).toHaveBeenCalled();
     expect(callback).toHaveBeenCalledWith('expected arg');
   });
   ```

## Quality and Coverage Criteria

### Coverage Thresholds

GHP Connector imposes a minimum coverage threshold of 80% for tested modules, which means:
- 80% of code lines must be executed
- 80% of conditional branches must be tested
- 80% of functions must be covered
- 80% of statements must be covered

These thresholds are defined in `jest.config.js` and checked when running the `npm run test:coverage:check` command.

### Test Quality

Beyond coverage, test quality is evaluated according to the following criteria:

1. **Isolation**: Tests should not depend on the execution environment or external services
2. **Determinism**: Tests should give the same results on each run
3. **Readability**: Tests should be easy to understand
4. **Maintenance**: Tests should be easy to maintain as the code evolves

### Code Review

During code reviews, tests will be evaluated according to the following criteria:

- Do new modules have adequate tests?
- Do tests cover edge cases and error scenarios?
- Are mocks used correctly to isolate tests?
- Are tests organized logically with `describe` and `it`?
- Are assertions specific enough?

### Continuous Integration

Tests are automatically run in the CI/CD pipeline for each commit and pull request. This pipeline:
- Runs all tests
- Checks code coverage
- Generates coverage reports viewable in the CI/CD interface

## Additional Resources

- [Quick Start Guide](./quick-start.md)
- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [Advanced Mocks Documentation](./advanced-mocks.md)
- [Code Coverage Documentation](./code-coverage.md) 