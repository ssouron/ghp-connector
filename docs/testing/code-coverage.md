# Code Coverage Reports

This document explains how to use and interpret code coverage reports in GHP Connector.

## Overview

Code coverage is a metric that measures the percentage of source code executed during tests. It's an important indicator for identifying parts of the code that are not tested or insufficiently tested.

GHP Connector requires a minimum coverage of 80% for tested modules (currently the modules in `src/lib/config`, `src/lib/errors`, and `src/lib/formatters`), which means that:
- 80% of code lines must be executed during tests
- 80% of conditional branches must be tested
- 80% of functions must be covered
- 80% of statements must be covered

As new modules are developed and tested, they will be added to the list of modules subject to the 80% coverage threshold.

## Generating Coverage Reports

To generate a code coverage report, use the command:

```bash
npm run test:coverage
```

This command runs the tests and generates a detailed report in the `coverage/` folder.

To check if your code meets the minimum coverage thresholds (80%), use:

```bash
npm run test:coverage:check
```

This command will fail if the coverage is below the defined thresholds.

## Interpreting Reports

### Terminal Report

The report displayed in the terminal gives a quick overview of the coverage:

```
--------------|---------|----------|---------|---------|-------------------
File          | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
--------------|---------|----------|---------|---------|-------------------
All files     |   85.71 |    83.33 |   84.62 |   85.71 |                   
 src          |   82.35 |    80.00 |   81.82 |   82.35 |                   
  cli.ts      |   90.91 |    85.71 |   88.89 |   90.91 | 45-46,78          
  index.ts    |   73.68 |    75.00 |   75.00 |   73.68 | 12-15,22-25       
 src/commands |   89.47 |    85.71 |   87.50 |   89.47 |                   
  issue.ts    |   89.47 |    85.71 |   87.50 |   89.47 | 102-105           
--------------|---------|----------|---------|---------|-------------------
```

The columns indicate:
- **% Stmts**: Percentage of statements covered
- **% Branch**: Percentage of conditional branches covered
- **% Funcs**: Percentage of functions covered
- **% Lines**: Percentage of lines covered
- **Uncovered Line #s**: Numbers of lines not covered

### HTML Report

A more detailed HTML report is available in `coverage/lcov-report/index.html`. To view it:

1. Open this file in your browser
2. Navigate through the file tree
3. Lines in green are covered, lines in red are not

## Improving Coverage

To improve code coverage:

1. **Identify uncovered areas**: Check the reports to identify untested parts of the code
2. **Add targeted tests**: Write tests specifically for uncovered features
3. **Test edge cases**: Make sure to test boundary conditions and error paths
4. **Check conditional branches**: Test all branches of if/else statements and ternary operators

## CI/CD Integration

Coverage checking is integrated into the CI/CD pipeline:

1. Each pull request and push to the main branch triggers tests
2. Code coverage is checked against the defined thresholds
3. Coverage reports are generated and available as artifacts

## Best Practices

- Don't lower coverage thresholds without prior discussion
- Write tests at the same time as the code
- Prioritize tests on critical business logic
- Don't aim for 100% coverage at all costs; some parts of the code may be difficult to test with a good cost/benefit ratio 