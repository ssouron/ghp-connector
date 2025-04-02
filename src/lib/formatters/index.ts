/**
 * Output formatting system
 * Provides different formatters for CLI output with a flexible, extensible architecture
 */

// Export core types and interfaces
export * from './base';
export * from './config';
export * from './errors';
export * from './registry';
export * from './factory';

// Export implementations
export * from './implementations';

// Import necessary components
import { BaseFormatter, FormatType } from './base';
import { FormatterRegistry } from './registry';
import { FormatterFactory } from './factory';
import { FormatterConfig } from './config';
import { TextFormatter } from './implementations/text';

/**
 * JSON formatter - outputs data as formatted JSON
 */
export class JsonFormatter extends BaseFormatter {
  private indent = 2;
  private sortKeys = false;
  private compact = false;

  constructor() {
    super('json');
  }

  format(data: any): string {
    const space = this.compact ? 0 : this.indent;

    const replacer = this.sortKeys ? (key: string, value: any) => value : undefined;

    return JSON.stringify(data, replacer, space);
  }

  configure(config: FormatterConfig & { indent?: number; sortKeys?: boolean; compact?: boolean }): void {
    if (config.indent !== undefined) this.indent = config.indent;
    if (config.sortKeys !== undefined) this.sortKeys = config.sortKeys;
    if (config.compact !== undefined) this.compact = config.compact;
  }

  getSupportedFormats(): FormatType[] {
    return ['json'];
  }
}

/**
 * Human-readable formatter - outputs data in a human-friendly format
 * This is the default formatter
 */
export class HumanFormatter extends TextFormatter {
  constructor() {
    super();
  }

  getSupportedFormats(): FormatType[] {
    return ['human'];
  }
}

/**
 * Default registry with standard formatters
 */
export const defaultRegistry = new FormatterRegistry();

// Register standard formatters
defaultRegistry.register(new JsonFormatter());
defaultRegistry.register(new TextFormatter());
defaultRegistry.register(new HumanFormatter());

/**
 * Default formatter factory using the default registry
 */
export const defaultFactory = new FormatterFactory(defaultRegistry);

/**
 * Format data according to the specified format type
 * This is a convenience function that uses the default factory
 * @param data Data to format
 * @param format Format type to use
 * @param config Optional configuration
 * @returns Formatted string
 */
export function formatOutput<T extends FormatType>(data: any, format: T = 'human' as T, config?: any): string {
  return defaultFactory.format(data, format, config);
}
