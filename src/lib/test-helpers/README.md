# Test Helpers

This directory contains utilities to facilitate testing in GHP Connector.

## Mocks for External Dependencies

### fs Module (File System)

```typescript
import { mockFs, mockVirtualFs } from './mocks/fs-mock';

// Simple fs mock
const { fs: fsMock, restore } = mockFs();
// Use fsMock as you would use fs
fsMock.existsSync('some-file.txt'); // Returns false by default
// Restore mocks when you're done
restore();

// Mock with virtual file system
const initialFiles = {
  '/test.txt': 'File content',
  '/config.json': '{ "key": "value" }'
};
const { fs: fsMock, restore, getVirtualFs } = mockVirtualFs(initialFiles);
// Use fsMock to interact with the virtual file system
fsMock.existsSync('/test.txt'); // true
fsMock.readFileSync('/test.txt', 'utf8'); // 'File content'
// Modify the file system
fsMock.writeFileSync('/new-file.txt', 'New content');
// Access the virtual file system
const virtualFs = getVirtualFs();
console.log(virtualFs['/new-file.txt']); // 'New content'
// Restore mocks when you're done
restore();
```

### GitHub API (Octokit)

```typescript
import { mockOctokit, mockGitHubClient } from './mocks/octokit-mock';

// Mock Octokit API
const octokit = mockOctokit({
  defaultIssueCount: 10, // Default number of issues to generate
  customResponses: {
    // Custom responses for specific requests
    repo: { name: 'custom-repo' },
    issues: {
      list: [/* custom issues */],
      get: {
        123: {/* custom issue for #123 */}
      }
    }
  }
});

// Use octokit as you would use the GitHub API
const repo = await octokit.rest.repos.get({ owner: 'test-owner', repo: 'test-repo' });
const issues = await octokit.rest.issues.listForRepo({ owner: 'test-owner', repo: 'test-repo' });

// Mock GitHub client
const client = mockGitHubClient({
  // Same options as for mockOctokit
});

// Use client as you would use GitHubClient
const repo = await client.getRepository();
const issues = await client.listIssues();
const issue = await client.getIssue(123);
```

### Environment Variables

```typescript
import { mockEnv, mockGitHubEnv, mockCIEnv } from './mocks/env-mock';

// Custom environment variables mock
const restore = mockEnv({
  vars: {
    NODE_ENV: 'test',
    API_KEY: 'test-key'
  },
  unset: ['HOME'] // Variables to remove
});

// Use environment variables
console.log(process.env.NODE_ENV); // 'test'
console.log(process.env.API_KEY); // 'test-key'
console.log(process.env.HOME); // undefined

// Restore original variables when done
restore();

// Predefined mocks
const restoreGitHub = mockGitHubEnv(); // Configure GitHub variables for tests
const restoreCI = mockCIEnv(); // Configure CI variables for tests
```

## Best Practices

1. **Isolate tests**: Use mocks to isolate your tests from external dependencies.
2. **Restore mocks**: Always call the `restore()` function after your tests to avoid side effects.
3. **Setup/Teardown**: Use `beforeEach` and `afterEach` to configure and clean up mocks.
4. **Realistic tests**: Configure your mocks to reflect the real behavior of dependencies.
5. **Don't over-mock**: Only mock what's necessary to isolate your tests.

## Complete Example

```typescript
import { mockFs, mockGitHubEnv } from '../test-helpers';

describe('My component', () => {
  let restoreFs;
  let restoreEnv;

  beforeEach(() => {
    // Setup
    restoreFs = mockFs().restore;
    restoreEnv = mockGitHubEnv();
  });

  afterEach(() => {
    // Teardown
    restoreFs();
    restoreEnv();
  });

  it('should do something', () => {
    // Test with mocks
  });
});
``` 