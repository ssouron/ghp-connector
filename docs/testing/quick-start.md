# Quick Start Testing Guide for GHP Connector

This quick start guide is intended for new developers who want to quickly understand how to run and write tests for GHP Connector.

## Quick Test Execution

### Standard Tests
```bash
npm test
```

### Watch Mode (Development)
```bash
npm run test:watch
```

### Tests with Coverage
```bash
npm run test:coverage
```

## Creating a Test in 5 Steps

1. **Create a test file** next to the file you want to test:
   ```
   src/lib/your-module/
   ├── index.ts               # Your module
   └── index.spec.ts          # Your tests
   ```

2. **Structure your test** with describe/it:
   ```typescript
   import { myFunction } from './index';
   
   describe('myFunction', () => {
     it('should produce the expected result', () => {
       // Your test here
     });
   });
   ```

3. **Use the AAA pattern** (Arrange-Act-Assert):
   ```typescript
   it('should add two numbers', () => {
     // Arrange (prepare the data)
     const a = 2;
     const b = 3;
     
     // Act (execute the function)
     const result = add(a, b);
     
     // Assert (verify the result)
     expect(result).toBe(5);
   });
   ```

4. **Use mocks** for external dependencies:
   ```typescript
   import { mockFs } from '../../test-helpers/mocks/fs-mock';
   
   it('should read a file', () => {
     // Create a file system mock
     const { fs: mockFs, restore } = mockFs();
     mockFs.readFileSync.mockReturnValue('file content');
     
     // Test...
     
     // Restore original behavior
     restore();
   });
   ```

5. **Test error cases** and edge cases:
   ```typescript
   it('should handle errors', () => {
     expect(() => {
       functionThatThrowsAnError();
     }).toThrow('expected error message');
   });
   ```

## Quick Tips

- **Isolation**: Make sure your tests are isolated and don't depend on external factors
- **Mocks**: Use the mocks provided in `src/lib/test-helpers/mocks/` for external dependencies
- **Coverage**: Aim for at least 80% coverage on all aspects (lines, branches, functions)
- **Asynchronous tests**: Use `async/await` or return promises for asynchronous tests
- **Cleanup**: Use `afterEach` or `afterAll` to clean up after your tests

## Examples

### Synchronous Function Test
```typescript
import { formatIssue } from './formatters';

describe('formatIssue', () => {
  it('should format an issue correctly', () => {
    const issue = {
      id: 123,
      title: 'Bug report',
      state: 'open'
    };
    
    const formatted = formatIssue(issue, 'minimal');
    
    expect(formatted).toBe('#123 Bug report (open)');
  });
});
```

### Asynchronous Function Test
```typescript
import { getIssue } from './github-client';
import { mockOctokit } from '../../test-helpers/mocks/octokit-mock';

describe('getIssue', () => {
  it('should retrieve an issue from GitHub', async () => {
    // Mock the GitHub API
    const octokit = mockOctokit({
      customResponses: {
        issues: {
          get: {
            123: { id: 123, title: 'Test Issue' }
          }
        }
      }
    });
    
    // Test with the mock
    const issue = await getIssue(octokit, 'owner', 'repo', 123);
    
    // Verification
    expect(issue).toEqual(expect.objectContaining({
      id: 123,
      title: 'Test Issue'
    }));
  });
});
```

## Additional Resources

For more details:
- [Complete testing guide](./guide.md)
- [Code coverage documentation](./code-coverage.md)
- [Advanced mocks documentation](./advanced-mocks.md)
- [Contributing guide](../../CONTRIBUTING.md) 