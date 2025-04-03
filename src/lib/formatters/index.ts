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
import { FormatType } from './base';
import { FormatterRegistry } from './registry';
import { FormatterFactory } from './factory';
import { TextFormatter } from './implementations/text';
import { JsonFormatter } from './implementations/json';

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
