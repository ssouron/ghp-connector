/**
 * Formatter configuration types
 * Provides configuration interfaces for formatters
 */

import { FormatType } from './base';

/**
 * Base configuration interface for all formatters
 */
export interface FormatterConfig {
  /**
   * Whether to use colors in the output (when supported)
   */
  useColors?: boolean;

  /**
   * Maximum width for output formatting (when applicable)
   */
  maxWidth?: number;
}

/**
 * Configuration for text formatter
 */
export interface TextFormatterConfig extends FormatterConfig {
  /**
   * Whether to include detailed information
   */
  detailed?: boolean;

  /**
   * Whether to format the output for terminal display
   */
  formatForTerminal?: boolean;
}

/**
 * Configuration for JSON formatter
 */
export interface JsonFormatterConfig extends FormatterConfig {
  /**
   * Number of spaces to use for indentation
   */
  indent?: number;

  /**
   * Whether to sort keys alphabetically
   */
  sortKeys?: boolean;

  /**
   * Whether to compact the output (no whitespace)
   */
  compact?: boolean;
}

/**
 * Configuration for table formatter
 */
export interface TableFormatterConfig extends FormatterConfig {
  /**
   * Columns to include in the table
   */
  columns?: string[];

  /**
   * Headers to use for the columns (maps to columns)
   */
  headers?: string[];

  /**
   * Alignment for each column ("left", "right", "center")
   */
  alignment?: Record<string, 'left' | 'right' | 'center'>;
}

/**
 * Type that maps format types to their configuration interfaces
 */
export type FormatterConfigMap = {
  text: TextFormatterConfig;
  json: JsonFormatterConfig;
  table: TableFormatterConfig;
  minimal: FormatterConfig;
  human: FormatterConfig;
  csv: FormatterConfig;
};

/**
 * Get configuration type for a specific format
 */
export type FormatterConfigForType<T extends FormatType> = T extends keyof FormatterConfigMap
  ? FormatterConfigMap[T]
  : FormatterConfig;

/**
 * Validate formatter configuration
 * @param config Configuration to validate
 * @param format Format type
 * @returns Validated configuration
 */
export function validateConfig<T extends FormatType>(
  config: Partial<FormatterConfigForType<T>> | undefined,
  format: T
): FormatterConfigForType<T> {
  // Start with default configuration
  const defaultConfig: FormatterConfig = {
    useColors: true,
    maxWidth: 80,
  };

  // Apply format-specific defaults
  let formatDefaults = {} as Partial<FormatterConfigForType<T>>;

  switch (format) {
    case 'json':
      formatDefaults = {
        indent: 2,
        sortKeys: false,
        compact: false,
      } as unknown as Partial<FormatterConfigForType<T>>;
      break;
    case 'table':
      formatDefaults = {
        columns: [],
        headers: [],
        alignment: {},
      } as unknown as Partial<FormatterConfigForType<T>>;
      break;
    case 'text':
      formatDefaults = {
        detailed: false,
        formatForTerminal: true,
      } as unknown as Partial<FormatterConfigForType<T>>;
      break;
  }

  // Merge defaults with provided config
  return {
    ...defaultConfig,
    ...formatDefaults,
    ...(config || {}),
  } as FormatterConfigForType<T>;
}
