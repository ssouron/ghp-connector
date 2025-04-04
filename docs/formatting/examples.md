# Output Formatting Examples

This document provides comprehensive examples of using the GHP Connector output formatting system in various scenarios.

## CLI Examples

### Basic Format Selection

```bash
# Default format (human-readable)
ghp issue list

# JSON format
ghp issue list --format=json

# Text format
ghp issue list --format=text
```

### JSON Formatting Options

```bash
# Pretty-printed JSON
ghp issue list --format=json --pretty

# Pretty-printed with custom indentation
ghp issue list --format=json --pretty --indent=4

# Compact JSON (default)
ghp issue list --format=json --compact
```

### Text and Human Formatting Options

```bash
# Detailed text output
ghp issue list --format=text --detailed

# Text without colors
ghp issue list --format=text --no-colors

# Human output without emoji
ghp issue list --format=human --no-emoji
```

### Combining Multiple Options

```bash
# Text output with detailed info and custom width
ghp issue list --format=text --detailed --max-width=120

# Human format with detailed info, no colors, and no emoji
ghp issue list --format=human --detailed --no-colors --no-emoji
```

## Code Examples

### Basic Formatting

```typescript
import { formatOutput } from 'ghp-connector';

// Get data (e.g., from GitHub API)
const issues = await getGithubIssues();

// Format with default formatter (human-readable)
const readableOutput = formatOutput(issues);
console.log(readableOutput);

// Format as JSON
const jsonOutput = formatOutput(issues, 'json');
console.log(jsonOutput);

// Format as text
const textOutput = formatOutput(issues, 'text');
console.log(textOutput);
```

### Configured Formatting

```typescript
import { formatOutput } from 'ghp-connector';

const issues = await getGithubIssues();

// Pretty-printed JSON
const prettyJson = formatOutput(issues, 'json', {
  pretty: true,
  indent: 2,
});
console.log(prettyJson);

// Detailed text
const detailedText = formatOutput(issues, 'text', {
  detailed: true,
  useColors: true,
  maxWidth: 100,
});
console.log(detailedText);

// Human-readable with custom options
const customHuman = formatOutput(issues, 'human', {
  emoji: true,
  useColors: true,
  detailed: true,
  interactive: false,
});
console.log(customHuman);
```

### Working with the Formatter Registry

```typescript
import { FormatterRegistry, FormatterFactory, JsonFormatter, TextFormatter, HumanFormatter } from 'ghp-connector';

// Create a custom registry
const registry = new FormatterRegistry();

// Register formatters
registry.register(new JsonFormatter());
registry.register(new TextFormatter());
registry.register(new HumanFormatter());

// Set default format
registry.setDefaultFormat('json');

// Create factory with registry
const factory = new FormatterFactory(registry);

// Format data
const data = { id: 123, title: 'Example Issue', status: 'open' };
const output = factory.format(data, 'json', { pretty: true });
console.log(output);

// Get available formats
const formats = registry.getRegisteredFormats();
console.log(`Available formats: ${formats.join(', ')}`);
```

### Creating and Using Custom Formatters

```typescript
import { BaseFormatter, FormatType, defaultRegistry, formatOutput } from 'ghp-connector';

// Define configuration interface
interface CsvFormatterConfig {
  delimiter?: string;
  includeHeaders?: boolean;
  quoteValues?: boolean;
}

// Create custom formatter
class CsvFormatter extends BaseFormatter {
  private delimiter: string = ',';
  private includeHeaders: boolean = true;
  private quoteValues: boolean = false;

  constructor(config?: CsvFormatterConfig) {
    super('csv' as FormatType);
    if (config) {
      this.configure(config);
    }
  }

  configure(config: CsvFormatterConfig): void {
    if (config.delimiter !== undefined) {
      this.delimiter = config.delimiter;
    }
    if (config.includeHeaders !== undefined) {
      this.includeHeaders = config.includeHeaders;
    }
    if (config.quoteValues !== undefined) {
      this.quoteValues = config.quoteValues;
    }
  }

  supports(data: any): boolean {
    return Array.isArray(data) && data.length > 0 && typeof data[0] === 'object';
  }

  format(data: any[]): string {
    if (!this.supports(data)) {
      return '';
    }

    const rows: string[] = [];
    const headers = Object.keys(data[0]);

    // Add headers row
    if (this.includeHeaders) {
      const headerRow = headers.map((header) => (this.quoteValues ? `"${header}"` : header)).join(this.delimiter);
      rows.push(headerRow);
    }

    // Add data rows
    for (const item of data) {
      const values = headers.map((header) => {
        const value = item[header] !== undefined ? String(item[header]) : '';
        return this.quoteValues ? `"${value.replace(/"/g, '""')}"` : value;
      });
      rows.push(values.join(this.delimiter));
    }

    return rows.join('\n');
  }

  getSupportedFormats(): FormatType[] {
    return ['csv' as FormatType];
  }
}

// Register the formatter
defaultRegistry.register(new CsvFormatter());

// Use the custom formatter
const issues = [
  { id: 1, title: 'Bug fix', status: 'open' },
  { id: 2, title: 'New feature', status: 'closed' },
];

// Format as CSV
const csvOutput = formatOutput(issues, 'csv' as FormatType);
console.log(csvOutput);
// Output:
// id,title,status
// 1,Bug fix,open
// 2,New feature,closed

// With custom configuration
const customCsvOutput = formatOutput(issues, 'csv' as FormatType, {
  delimiter: ';',
  quoteValues: true,
});
console.log(customCsvOutput);
// Output:
// "id";"title";"status"
// "1";"Bug fix";"open"
// "2";"New feature";"closed"
```

## Integration Examples

### Integrating with Command Line Tools

```typescript
import { formatOutput } from 'ghp-connector';
import { spawnSync } from 'child_process';

// Generate data using external command
const result = spawnSync('some-command', ['--arg1', 'value1'], { encoding: 'utf8' });
const data = JSON.parse(result.stdout);

// Format for display
const output = formatOutput(data, 'human', { detailed: true });
console.log(output);
```

### Writing Formatted Output to Files

```typescript
import { formatOutput } from 'ghp-connector';
import { writeFileSync } from 'fs';

// Get data
const data = await fetchData();

// Format as JSON
const jsonOutput = formatOutput(data, 'json', { pretty: true, indent: 2 });

// Write to file
writeFileSync('output.json', jsonOutput, 'utf8');
console.log('Output written to output.json');

// Format as CSV using custom formatter
const csvOutput = formatOutput(data, 'csv' as FormatType, { delimiter: ',' });

// Write to CSV file
writeFileSync('output.csv', csvOutput, 'utf8');
console.log('Output written to output.csv');
```

### Integration with GitHub API Responses

```typescript
import { formatOutput } from 'ghp-connector';
import { Octokit } from '@octokit/rest';

// Initialize Octokit
const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

// Get issues from GitHub
async function getIssues() {
  const response = await octokit.issues.listForRepo({
    owner: 'owner',
    repo: 'repo',
    state: 'open',
  });

  // Format the response in different ways
  console.log('--- JSON Output ---');
  console.log(formatOutput(response.data, 'json', { pretty: true }));

  console.log('--- Human Output ---');
  console.log(formatOutput(response.data, 'human', { detailed: true }));

  console.log('--- Text Output ---');
  console.log(formatOutput(response.data, 'text'));
}

getIssues().catch(console.error);
```

### Using in GitHub Actions

```yaml
name: GHP Example Workflow

on:
  issues:
    types: [opened, edited, closed]

jobs:
  process-issue:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v2

      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '16'

      - name: Install dependencies
        run: npm install ghp-connector

      - name: Process issue
        run: |
          # Machine-readable JSON output for processing
          npx ghp issue get --id=${{ github.event.issue.number }} --format=json > issue.json

          # Human-readable output for logs
          npx ghp issue get --id=${{ github.event.issue.number }} --format=human
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

## Real-World Use Cases

### Custom Dashboard Generation

```typescript
import { formatOutput } from 'ghp-connector';
import { writeFileSync } from 'fs';

async function generateDashboard() {
  // Fetch data
  const issues = await getOpenIssues();
  const pullRequests = await getPullRequests();

  // Create dashboard data
  const dashboard = {
    timestamp: new Date().toISOString(),
    summary: {
      openIssues: issues.length,
      openPullRequests: pullRequests.length,
      priorityIssues: issues.filter((i) => i.labels.includes('priority')).length,
    },
    recentIssues: issues.slice(0, 5),
    recentPullRequests: pullRequests.slice(0, 5),
  };

  // Generate outputs in different formats
  const jsonOutput = formatOutput(dashboard, 'json', { pretty: true });
  writeFileSync('dashboard.json', jsonOutput);

  const humanOutput = formatOutput(dashboard, 'human', { detailed: true });
  writeFileSync('dashboard.txt', humanOutput);

  console.log('Dashboard generated successfully');
}

generateDashboard().catch(console.error);
```

### Issue Report Generation

```typescript
import { formatOutput } from 'ghp-connector';
import { createTransport } from 'nodemailer';

async function generateAndSendReport() {
  // Fetch issues
  const issues = await getIssues({ state: 'open', labels: ['bug'] });

  // Format as human-readable text
  const textReport = formatOutput(issues, 'text', {
    detailed: true,
    useColors: false, // Plain text for email
    maxWidth: 80,
  });

  // Format as JSON for attachment
  const jsonReport = formatOutput(issues, 'json', { pretty: true });

  // Send email
  const transporter = createTransport({
    /* email config */
  });

  await transporter.sendMail({
    from: 'reports@example.com',
    to: 'team@example.com',
    subject: 'Weekly Bug Report',
    text: `Weekly Bug Report\n\n${textReport}`,
    attachments: [
      {
        filename: 'bugs.json',
        content: jsonReport,
      },
    ],
  });

  console.log('Report sent successfully');
}

generateAndSendReport().catch(console.error);
```

### API Endpoint with Multiple Format Support

```typescript
import express from 'express';
import { formatOutput } from 'ghp-connector';

const app = express();

// API endpoint with format selection
app.get('/api/issues', async (req, res) => {
  try {
    // Get issues from database or GitHub API
    const issues = await getIssues();

    // Determine output format from request
    const format = req.query.format || 'json';

    // Format-specific options
    const options = {};

    if (format === 'json') {
      options.pretty = req.query.pretty === 'true';
      if (options.pretty && req.query.indent) {
        options.indent = parseInt(req.query.indent);
      }
    } else if (format === 'text' || format === 'human') {
      options.detailed = req.query.detailed === 'true';
      options.useColors = false; // No colors for API responses
    }

    // Format the output
    const output = formatOutput(issues, format as any, options);

    // Set content type based on format
    if (format === 'json') {
      res.setHeader('Content-Type', 'application/json');
    } else {
      res.setHeader('Content-Type', 'text/plain');
    }

    res.send(output);
  } catch (error) {
    res.status(500).json({ error: String(error) });
  }
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
```
