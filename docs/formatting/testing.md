# Formatter Testing Guide

This guide outlines the testing infrastructure for the output formatting system in GHP Connector. It provides information on how to use the testing utilities to create comprehensive tests for formatters.

## Table of Contents

- [Overview](#overview)
- [Testing Utilities](#testing-utilities)
  - [Mock Data Generators](#mock-data-generators)
  - [Format-Specific Assertions](#format-specific-assertions)
  - [Performance Measurement](#performance-measurement)
  - [Test Fixtures](#test-fixtures)
  - [Integration Tests](#integration-tests)
- [Creating Formatter Tests](#creating-formatter-tests)
- [Handling Special Cases](#handling-special-cases)
- [Best Practices](#best-practices)

## Overview

The formatter testing infrastructure provides a comprehensive set of tools and utilities to test all aspects of the output formatting system. These tools allow for:

- Thorough testing of individual formatters
- Cross-format consistency validation
- Performance measurement and optimization
- Memory leak detection
- Error handling validation

All testing utilities are centralized in the `src/lib/test-helpers` directory and exported via `index.ts`.

### Formatter Types and Hierarchy

The formatting system includes the following formatters, organized in a hierarchy:

- **BaseFormatter** (abstract class)
  - **JsonFormatter**: For JSON output
  - **TextFormatter**: For plain text output
    - **HumanFormatter**: Extends TextFormatter with enhanced terminal features
  - **TableFormatter**: For tabular data (planned)
  - **MinimalFormatter**: For minimal output (planned)

When testing formatters, it's important to understand this hierarchy, as some formatters inherit functionality from their parent classes. For example, when testing HumanFormatter, you should also ensure that the base TextFormatter functionality works correctly.

## Testing Utilities

### Mock Data Generators

Located in `src/lib/test-helpers/mock-data.ts`, these utilities generate realistic GitHub-like data structures for testing:

```typescript
// Generate a single mock GitHub issue
const issue = generateMockIssue({
  title: 'Test Issue',
  state: 'open',
});

// Generate multiple issues
const issues = generateMockIssues(10);

// Create data with circular references for testing edge cases
const circularData = generateCircularData();
```

### Format-Specific Assertions

Located in `src/lib/test-helpers/assertions.ts`, these utilities provide format-specific validation:

```typescript
// JSON assertions
JsonAssertions.isValid(jsonOutput);
JsonAssertions.hasKey(jsonOutput, 'issues');
JsonAssertions.isPretty(jsonOutput);

// Text assertions
TextAssertions.hasKeys(textOutput, ['title', 'state']);
TextAssertions.containsAll(textOutput, ['line1', 'line2']);
TextAssertions.hasColors(textOutput);

// Cross-format assertions
CrossFormatAssertions.containSameData(jsonOutput, textOutput, 'json', 'text');
```

### Performance Measurement

Located in `src/lib/test-helpers/performance.ts`, these utilities help measure and optimize formatter performance:

```typescript
// Measure execution time
const { result, executionTime } = measureExecutionTime(() => {
  return formatter.format(data);
});

// Compare performance of multiple implementations
const results = comparePerformance(
  'Formatter Comparison',
  [
    { name: 'JSON', fn: (data) => jsonFormatter.format(data) },
    { name: 'Text', fn: (data) => textFormatter.format(data) },
  ],
  testData,
  { iterations: 10, warmupIterations: 2 }
);

// Check for memory leaks
const leakResults = checkForMemoryLeaks(
  (data) => formatter.format(data),
  (size) => generateMockIssues(size),
  { iterations: 3, initialSize: 10, sizesMultiplier: 5 }
);
```

### Test Fixtures

Located in `src/lib/test-helpers/fixtures.ts`, these provide reusable test data:

```typescript
// Common test data for all formatters
const primitives = FormatterFixtures.primitives;
const nested = FormatterFixtures.nested;
const specialChars = FormatterFixtures.specialCharacters;

// Format-specific test data
const jsonSpecific = JsonFormatterFixtures.specific.invalidValues;
const textSpecific = TextFormatterFixtures.specific.lineWrapping;
```

### Integration Tests

Located in `src/lib/formatters/integration.spec.ts`, these test cross-format behavior:

```typescript
// Cross-format consistency tests
describe('Cross-format consistency', () => {
  it('should maintain data integrity across formats', () => {
    const jsonOutput = jsonFormatter.format(data);
    const textOutput = textFormatter.format(data);

    JsonAssertions.isValid(jsonOutput);
    TextAssertions.hasKeys(textOutput, Object.keys(data));
    CrossFormatAssertions.containSameData(jsonOutput, textOutput, 'json', 'text');
  });
});
```

## Creating Formatter Tests

When creating tests for a new formatter:

1. **Create a dedicated test file**: For a formatter at `src/lib/formatters/implementations/csv/CsvFormatter.ts`, create a test file at `src/lib/formatters/implementations/csv/CsvFormatter.spec.ts`.

2. **Import test helpers**:

```typescript
import { FormatterFixtures, JsonAssertions, CsvAssertions, measureExecutionTime } from '../../../../test-helpers';
```

3. **Test basic functionality**:

```typescript
describe('CsvFormatter', () => {
  let formatter: CsvFormatter;

  beforeEach(() => {
    formatter = new CsvFormatter();
  });

  it('should format basic data correctly', () => {
    const data = FormatterFixtures.primitives;
    const output = formatter.format(data);

    CsvAssertions.isValid(output);
    expect(output).toContain('string,Hello, world!');
  });
});
```

4. **Test configuration options**:

```typescript
it('should respect custom delimiter configuration', () => {
  const formatter = new CsvFormatter({ delimiter: ';' });
  const output = formatter.format(simpleData);

  expect(output).toContain('string;Hello, world!');
});
```

5. **Test performance with large datasets**:

```typescript
it('should handle large datasets efficiently', () => {
  const largeDataset = FormatterFixtures.performance.largeDataset;

  const { executionTime } = measureExecutionTime(() => {
    return formatter.format(largeDataset);
  });

  expect(executionTime).toBeLessThan(5000); // 5 seconds max
});
```

6. **Add integration tests** for your new formatter in `integration.spec.ts` to ensure cross-format consistency.

## Handling Special Cases

### Circular References

Test how your formatter handles circular references:

```typescript
it('should handle circular references gracefully', () => {
  const circularData = FormatterFixtures.errors.circularReference;

  expect(() => formatter.format(circularData)).not.toThrow();
  const output = formatter.format(circularData);

  // Verify the result contains a placeholder for the circular reference
  expect(output).toContain('[Circular]');
});
```

### Invalid Values

Test how your formatter handles values that are challenging to format:

```typescript
it('should handle invalid values appropriately', () => {
  const troublesomeData = {
    fn: function () {
      return true;
    },
    symbol: Symbol('test'),
    nan: NaN,
    infinity: Infinity,
  };

  expect(() => formatter.format(troublesomeData)).not.toThrow();
});
```

## Best Practices

1. **Test with realistic data**: Use the mock data generators to create realistic GitHub-like data.

2. **Test configuration options**: Verify that all formatter configuration options work correctly.

3. **Test edge cases**: Ensure your formatter handles circular references, large datasets, deeply nested objects, and invalid values.

4. **Test performance**: Use the performance measurement utilities to ensure your formatter meets performance expectations.

5. **Test error handling**: Verify that your formatter handles errors gracefully and provides helpful error messages.

6. **Test cross-format consistency**: Ensure your formatter maintains data integrity across different formats.

7. **Document formatter limitations**: If your formatter has known limitations, document them in the tests and in the formatter documentation.

8. **Keep fixtures up to date**: Update test fixtures when adding new formatter features or fixing bugs.

By following these best practices, you'll create robust and reliable formatters that meet the high-quality standards of the GHP Connector project.
