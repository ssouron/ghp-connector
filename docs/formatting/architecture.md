# Output Formatting Architecture

This document outlines the architecture of the output formatting system in GHP Connector. The system is designed to be flexible, extensible, and type-safe.

## Overview

The formatting system provides a way to convert data into different output formats for display to users or consumption by other tools. The architecture follows a modular design with clear separation of concerns:

- **Formatters**: Convert data to specific output formats
- **Registry**: Manages available formatters
- **Factory**: Creates formatter instances on demand
- **Configuration**: Configures formatter behavior
- **Error Handling**: Provides specific error types

## Core Components

### Formatter Interface

All formatters implement the `IFormatter` interface, which defines the core contract:

```typescript
export interface IFormatter {
  format(data: any): string;
  supports(data: any): boolean;
  getSupportedFormats(): FormatType[];
  configure?(config: any): void;
}
```

The interface requires:

- `format`: Convert data to a string representation
- `supports`: Check if the formatter can handle specific data
- `getSupportedFormats`: Get formats supported by this formatter
- `configure` (optional): Configure the formatter's behavior

### BaseFormatter Abstract Class

An abstract base class that implements common formatter functionality:

```typescript
export abstract class BaseFormatter implements IFormatter {
  protected readonly formatType: FormatType;

  constructor(formatType: FormatType) {
    this.formatType = formatType;
  }

  abstract format(data: any): string;

  supports(_data: any): boolean {
    return true;
  }

  getSupportedFormats(): FormatType[] {
    return [this.formatType];
  }
}
```

### Formatter Registry

The registry maintains a collection of formatters and provides lookup functionality:

```typescript
export class FormatterRegistry {
  register(formatter: IFormatter): void;
  registerForFormat(format: FormatType, formatter: IFormatter): void;
  getFormatter(format: FormatType): IFormatter;
  hasFormatter(format: FormatType): boolean;
  getDefaultFormatter(): IFormatter;
  setDefaultFormat(format: FormatType): void;
  getDefaultFormat(): FormatType;
  getRegisteredFormats(): FormatType[];
  clear(): void;
}
```

### Formatter Factory

The factory creates formatter instances based on format type:

```typescript
export class FormatterFactory {
  constructor(private registry: FormatterRegistry);
  create<T extends FormatType>(format: T, config?: Partial<FormatterConfigForType<T>>): IFormatter;
  createDefault<T extends FormatType>(config?: Partial<FormatterConfigForType<T>>): IFormatter;
  format<T extends FormatType>(data: any, format: T, config?: Partial<FormatterConfigForType<T>>): string;
  formatWithDefault<T extends FormatType>(data: any, config?: Partial<FormatterConfigForType<T>>): string;
}
```

### Configuration Types

The system provides type-safe configuration for formatters:

```typescript
export interface FormatterConfig {
  useColors?: boolean;
  maxWidth?: number;
}

export interface TextFormatterConfig extends FormatterConfig {
  detailed?: boolean;
  formatForTerminal?: boolean;
}

export interface JsonFormatterOptions {
  pretty?: boolean;
  indent?: number;
  compact?: boolean;
}

export interface TableFormatterConfig extends FormatterConfig {
  columns?: string[];
  headers?: string[];
  alignment?: Record<string, 'left' | 'right' | 'center'>;
}
```

### Error Types

Specific error types for error handling and reporting:

```typescript
export class FormatterError extends GHPError;
export class UnsupportedFormatError extends FormatterError;
export class FormattingError extends FormatterError;
export class FormatterConfigurationError extends FormatterError;
```

## Standard Formatters

The system comes with several built-in formatters:

### JSON Formatter

Formats data as JSON. Located at `src/lib/formatters/implementations/json/JsonFormatter.ts`.

Key features:

- **Pretty Printing**: Supports indentation via `pretty: true` and `indent: <number>` options.
- **Compact Output**: Default behavior. Can be explicitly enabled with `compact: true`, overriding pretty-printing.
- **Sorted Keys**: Object keys are always sorted alphabetically recursively for consistent output.
- **Circular Reference Handling**: Detects and handles circular references gracefully, outputting `[Circular]`.

```typescript
export class JsonFormatter extends BaseFormatter {
  constructor(options?: JsonFormatterOptions);
  configure(options: JsonFormatterOptions): void;
  clone(): this;
  format(data: unknown): string;
}
```

### Text Formatter

Formats data as plain text with support for details and terminal formatting.

```typescript
export class TextFormatter extends BaseFormatter;
```

### Human Formatter

Formats data in a human-friendly way, optimized for readability.

```typescript
export class HumanFormatter extends TextFormatter;
```

## Usage

The system provides a simple way to format data:

```typescript
// Using the default formatter (human-readable)
const output = formatOutput(data);

// Using a specific formatter
const jsonOutput = formatOutput(data, 'json');

// With configuration
const compactJson = formatOutput(data, 'json', { compact: true });

// Or with the factory and registry directly
const registry = new FormatterRegistry();
registry.register(new JsonFormatter());
const factory = new FormatterFactory(registry);
const result = factory.format(data, 'json', { indent: 4 });
```

## Extension

To add a new formatter:

1. Create a class that implements `IFormatter` or extends `BaseFormatter`
2. Register it with the registry
3. Use it via the factory or `formatOutput` function

Example:

```typescript
export class CsvFormatter extends BaseFormatter {
  constructor() {
    super('csv');
  }

  format(data: any): string {
    // CSV formatting logic
  }
}

// Register the formatter
defaultRegistry.register(new CsvFormatter());
```

## Error Handling

The system provides comprehensive error handling:

- `UnsupportedFormatError` when a format is not supported
- `FormattingError` when formatting fails
- `FormatterConfigurationError` when configuration is invalid

Errors propagate through the factory to the caller, with appropriate error messages and context.

## Performance Considerations

- Formatters are created on demand and cached in the registry
- Configuration is validated only when needed
- Large datasets are processed efficiently

## Future Enhancements

- CSV formatter implementation
- Advanced table formatting
- Custom templates
- Stream-based formatting for large datasets
