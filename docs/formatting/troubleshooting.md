# Formatting System Troubleshooting Guide

This document provides solutions for common issues and error scenarios when using the GHP Connector output formatting system.

## Common Issues and Solutions

### Format Selection Issues

| Problem                         | Possible Cause                                             | Solution                                                                       |
| ------------------------------- | ---------------------------------------------------------- | ------------------------------------------------------------------------------ |
| Unknown format error            | Specified format is not registered                         | Use `--format` with a supported format: `json`, `text`, or `human`             |
| Format not appropriate for task | Selected format doesn't suit the content                   | Choose `json` for machine processing, `text` or `human` for human readability  |
| Unreadable output               | Wrong format for viewing context                           | Use `--format=human` for terminal display, `--format=json` for data processing |
| Missing colors in output        | Terminal doesn't support colors or `--no-colors` flag used | Use `--format=human` without `--no-colors` in a color-supporting terminal      |
| Missing emojis                  | Terminal doesn't support emoji or `--no-emoji` flag used   | Use `--format=human` without `--no-emoji` in a terminal with emoji support     |

> **Note**: The `table` and `minimal` formats are planned for future releases and not yet fully implemented.

### JSON Formatter Issues

| Issue                        | Possible Causes                     | Solutions                                                            |
| ---------------------------- | ----------------------------------- | -------------------------------------------------------------------- |
| JSON output is one long line | Default `compact` mode is enabled   | Use `--format=json --pretty` for readable output                     |
| JSON parsing errors          | Circular references in data objects | System handles this automatically with `[Circular]` replacement      |
| Inconsistent key ordering    | Default sort behavior               | Keys are sorted alphabetically by default; this is expected behavior |
| Unexpected indentation       | Conflicting indent options          | Explicitly set indent with `--format=json --pretty --indent=2`       |

### Text/Human Formatter Issues

| Issue                         | Possible Causes                      | Solutions                                                       |
| ----------------------------- | ------------------------------------ | --------------------------------------------------------------- |
| Missing details in output     | Standard mode active                 | Use `--detailed` flag for more information                      |
| Truncated output              | Terminal width constraints           | Adjust terminal size or use `--max-width=<n>` with larger value |
| Emoji rendering issues        | Terminal doesn't support emoji       | Use `--no-emoji` flag                                           |
| Colors appear as escape codes | Terminal doesn't support ANSI colors | Use `--no-colors` flag                                          |

## Error Messages

### UnsupportedFormatError

```
Error: Format 'csv' is not supported. Available formats: json, text, human
```

**Cause**: Requested format is not registered in the formatter registry.

**Solution**: Use one of the supported formats or register a custom formatter for the desired format.

```typescript
// Register custom formatter
import { defaultRegistry } from 'ghp-connector';
defaultRegistry.register(new CsvFormatter());
```

### FormatterConfigurationError

```
Error: Invalid configuration for JSON formatter: 'indent' option requires 'pretty' to be true
```

**Cause**: Configuration options have constraints or dependencies not met.

**Solution**: Check the formatting configuration documentation and ensure option combinations are valid.

```bash
# Correct usage
ghp issue list --format=json --pretty --indent=4

# Incorrect usage
ghp issue list --format=json --indent=4  # Missing --pretty flag
```

### FormattingError

```
Error: Failed to format data: TypeError: Cannot convert circular structure to JSON
```

**Cause**: The data structure could not be formatted due to inherent issues.

**Solution**: The system should handle circular references automatically. If you encounter this error, it may indicate a bug.

## Performance Problems

### Slow Formatting for Large Datasets

**Symptoms**:

- Long processing times for large collections
- High memory usage
- Unresponsive CLI

**Causes**:

- Very large datasets being fully formatted
- Complex nested structures with circular references
- Pretty printing with deep nesting

**Solutions**:

- Use compact JSON for large datasets: `--format=json --compact`
- Limit the dataset size with pagination or filtering
- Avoid `--detailed` mode for large collections
- Use streaming when possible (future feature)

```bash
# More efficient for large datasets
ghp issue list --format=json --compact --limit=100
```

### Memory Usage Issues

**Symptoms**:

- Out of memory errors
- Excessive memory consumption

**Causes**:

- Very large datasets
- Complex object structures with many properties

**Solutions**:

- Use filtering to reduce data size
- Process data in batches
- Select only needed fields
- Consider custom formatters for specific data types

## Advanced Troubleshooting

### Debugging Formatters

For developers, you can enable debug mode to see detailed information about the formatting process:

```typescript
import { setDebugMode } from 'ghp-connector';

// Enable debug mode
setDebugMode(true);

// Format with debug information
const output = formatOutput(data, 'json');
```

### Testing Custom Formatters

If you're developing custom formatters and experiencing issues:

1. Ensure your formatter implements the `IFormatter` interface correctly
2. Validate that `getSupportedFormats()` returns the correct format types
3. Check that your formatter is properly registered
4. Test with simple data structures before complex ones

```typescript
// Test your formatter with simple data
const simpleData = { id: 1, name: 'Test' };
const output = myFormatter.format(simpleData);
console.log(output);

// Then test with more complex data
const complexData = /* ... */;
const output2 = myFormatter.format(complexData);
```

### Formatter Registration Issues

If your custom formatter is not being selected:

1. Check that it's registered in the registry
2. Verify that the format name is correctly specified
3. Ensure no name conflicts with built-in formatters

```typescript
// Check registration
console.log(defaultRegistry.getRegisteredFormats());
console.log(defaultRegistry.hasFormatter('my-format'));
```

## CLI Validation Errors

The CLI performs validation of format-related arguments. Common validation errors include:

| Error Message                                                 | Explanation                                       | Solution                                     |
| ------------------------------------------------------------- | ------------------------------------------------- | -------------------------------------------- |
| "Option '--pretty' requires '--format=json'"                  | The `--pretty` flag is only valid for JSON format | Specify `--format=json` with `--pretty`      |
| "Option '--indent' requires '--pretty' to be enabled"         | Indentation is only used with pretty printing     | Use both `--pretty` and `--indent=<n>`       |
| "Option '--detailed' is only valid for text or human formats" | The `--detailed` flag doesn't apply to JSON       | Use with `--format=text` or `--format=human` |

## Environment-Specific Issues

### Terminal Support Detection

The system attempts to detect terminal capabilities automatically:

```typescript
import { isColorSupported, isInteractive } from 'ghp-connector';

// Check if color is supported
if (isColorSupported()) {
  // Use colors
}

// Check if terminal is interactive
if (isInteractive()) {
  // Use interactive features
}
```

If auto-detection isn't working correctly, you can override it:

```bash
# Force colors on
export FORCE_COLOR=1

# Force colors off
export FORCE_COLOR=0

# Force non-interactive mode
export CI=true
```

### CI/CD Pipeline Issues

In CI/CD environments, you might encounter:

1. Unexpected format due to environment detection
2. Color codes in logs when not supported
3. Interactive elements causing script failures

Solutions:

```bash
# In CI scripts, explicitly set format and disable features
ghp issue list --format=json --no-colors --no-interactive
```

## Getting Help

If you encounter issues not covered in this guide:

1. Check the GitHub Issues for similar problems
2. Consult the API documentation
3. Run GHP with debug logging: `GHP_DEBUG=1 ghp issue list`
4. Submit a detailed bug report with reproduction steps
