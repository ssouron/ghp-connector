# Formatter Configuration

This document provides a comprehensive guide to the configuration options available for each formatter in the GHP Connector output formatting system.

## Overview

Each formatter in the system can be configured with specific options that control its output behavior. Configuration can be provided through:

1. CLI options (for command-line users)
2. Direct configuration via code (for developers)

## Common Configuration Options

These options are available for all formatters:

| Option      | Type    | Default | Description                                           |
| ----------- | ------- | ------- | ----------------------------------------------------- |
| `useColors` | boolean | `true`  | Whether to use colors in output (when supported)      |
| `maxWidth`  | number  | `80`    | Maximum width of output for wrapping (when supported) |

## Format-Specific Configuration

### JSON Formatter (`json`)

| Option     | Type    | Default | CLI Flag       | Description                                                |
| ---------- | ------- | ------- | -------------- | ---------------------------------------------------------- |
| `pretty`   | boolean | `false` | `--pretty`     | Enable pretty printing with indentation                    |
| `indent`   | number  | `2`     | `--indent=<n>` | Number of spaces for indentation (requires `pretty: true`) |
| `compact`  | boolean | `true`  | `--compact`    | Use compact format (single line, no whitespace)            |
| `sortKeys` | boolean | `true`  | N/A            | Sort object keys alphabetically (recursive)                |

#### CLI Examples

```bash
# Pretty-printed JSON with 2-space indentation
ghp issue list --format=json --pretty

# Pretty-printed JSON with 4-space indentation
ghp issue list --format=json --pretty --indent=4

# Compact JSON (default)
ghp issue list --format=json
# or explicitly
ghp issue list --format=json --compact
```

#### Code Examples

```typescript
import { formatOutput } from 'ghp-connector';

// Pretty-printed with default indentation (2 spaces)
const prettyOutput = formatOutput(data, 'json', {
  pretty: true,
});

// Pretty-printed with custom indentation
const customIndentOutput = formatOutput(data, 'json', {
  pretty: true,
  indent: 4,
});

// Compact output (default)
const compactOutput = formatOutput(data, 'json');
// or explicitly
const explicitCompactOutput = formatOutput(data, 'json', {
  compact: true,
});
```

### Text Formatter (`text`)

| Option              | Type    | Default | CLI Flag          | Description                                         |
| ------------------- | ------- | ------- | ----------------- | --------------------------------------------------- |
| `detailed`          | boolean | `false` | `--detailed`      | Include detailed information in output              |
| `formatForTerminal` | boolean | `true`  | N/A               | Format output specifically for terminal display     |
| `useColors`         | boolean | `true`  | `--no-colors`     | Use colors in output (inherited from common config) |
| `maxWidth`          | number  | `80`    | `--max-width=<n>` | Maximum width for text wrapping                     |

#### CLI Examples

```bash
# Detailed text output
ghp issue list --format=text --detailed

# Text output without colors
ghp issue list --format=text --no-colors

# Text output with custom max width
ghp issue list --format=text --max-width=100
```

#### Code Examples

```typescript
import { formatOutput } from 'ghp-connector';

// Detailed text output
const detailedOutput = formatOutput(data, 'text', {
  detailed: true,
});

// Text without colors
const noColorOutput = formatOutput(data, 'text', {
  useColors: false,
});

// Custom width
const wideOutput = formatOutput(data, 'text', {
  maxWidth: 120,
});
```

### Human Formatter (`human`)

Inherits all options from the Text Formatter, plus:

| Option        | Type    | Default | CLI Flag           | Description                                  |
| ------------- | ------- | ------- | ------------------ | -------------------------------------------- |
| `emoji`       | boolean | `true`  | `--no-emoji`       | Include emoji in output                      |
| `interactive` | boolean | `true`  | `--no-interactive` | Enable interactive elements (when supported) |

#### CLI Examples

```bash
# Human output without emoji
ghp issue list --format=human --no-emoji

# Human output without interactive elements
ghp issue list --format=human --no-interactive

# Combines with text formatter options
ghp issue list --format=human --detailed --no-colors
```

#### Code Examples

```typescript
import { formatOutput } from 'ghp-connector';

// Human output without emoji
const noEmojiOutput = formatOutput(data, 'human', {
  emoji: false,
});

// Non-interactive output
const nonInteractiveOutput = formatOutput(data, 'human', {
  interactive: false,
});

// Combined options
const customOutput = formatOutput(data, 'human', {
  detailed: true,
  useColors: false,
  emoji: true,
  maxWidth: 100,
});
```

## Configuration Combinations and Constraints

Some configuration options have dependencies or constraints:

1. `indent` option is only used when `pretty` is set to `true` for JSON formatter
2. Setting `pretty: true` automatically sets `compact: false` for JSON formatter
3. Setting `compact: true` forces `pretty: false` for JSON formatter

## Performance Implications

Configuration choices can impact performance:

| Option                  | Performance Impact                                             |
| ----------------------- | -------------------------------------------------------------- |
| `sortKeys` (JSON)       | Minor performance cost for large objects; improves consistency |
| `pretty` (JSON)         | Increases output size; slight processing overhead              |
| `detailed` (Text/Human) | Increases processing time for complex data structures          |
| `emoji` (Human)         | Negligible impact                                              |

For large datasets:

- JSON formatter with `compact: true` provides best performance
- Avoid `detailed: true` for very large collections
- Consider limiting output fields when possible

## Environment-Specific Configuration

### Terminal Detection

The formatting system automatically detects terminal capabilities and adjusts output:

- When outputting to a terminal, colors are enabled by default
- When piping to a file or another process, colors are disabled by default
- This behavior can be overridden with explicit configuration

### CI/CD Environments

In CI/CD environments:

- Colors are disabled by default
- Interactive elements are disabled
- These defaults help ensure compatibility with CI/CD systems

## Advanced Configuration

### Custom Registry Configuration

For developers integrating the library:

```typescript
import { FormatterRegistry, JsonFormatter, TextFormatter } from 'ghp-connector';

// Create and configure a custom registry
const registry = new FormatterRegistry();

// Configure JSON formatter with custom defaults
const jsonFormatter = new JsonFormatter({
  pretty: true,
  indent: 4,
  sortKeys: true,
});
registry.register(jsonFormatter);

// Configure Text formatter with custom defaults
const textFormatter = new TextFormatter();
textFormatter.configure({
  detailed: true,
  useColors: false,
});
registry.register(textFormatter);

// Set default format
registry.setDefaultFormat('json');
```
