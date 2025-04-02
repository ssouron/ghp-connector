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

// Import necessary components
import { BaseFormatter, FormatType } from './base';
import { FormatterRegistry } from './registry';
import { FormatterFactory } from './factory';
import { FormatterConfig } from './config';

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
 * Text formatter - outputs data in plain text format
 */
export class TextFormatter extends BaseFormatter {
  private detailed = false;

  constructor() {
    super('text');
  }

  format(data: any): string {
    if (data === null || data === undefined) {
      return '';
    }

    if (typeof data === 'string') {
      return data;
    }

    if (Array.isArray(data)) {
      return this.formatArray(data);
    }

    if (typeof data === 'object') {
      return this.formatObject(data);
    }

    return String(data);
  }

  private formatArray(arr: any[]): string {
    if (arr.length === 0) {
      return 'No items.';
    }

    return arr.map((item) => this.format(item)).join('\n');
  }

  private formatObject(obj: Record<string, any>): string {
    // Special handling for GitHub issues
    if ('number' in obj && 'title' in obj) {
      let result = `#${obj.number} ${obj.title}`;
      if (obj.state) {
        result += ` [${obj.state}]`;
      }

      if (this.detailed && obj.body) {
        result += `\n\n${obj.body}`;
      }

      return result;
    }

    // Default object formatting
    return Object.entries(obj)
      .filter(([, value]) => value !== null && value !== undefined)
      .map(([key, value]) => `${key}: ${this.formatValue(value)}`)
      .join('\n');
  }

  private formatValue(value: any): string {
    if (typeof value === 'object' && value !== null) {
      if (Array.isArray(value)) {
        return value.map((v) => this.formatValue(v)).join(', ');
      }

      return this.detailed
        ? `\n${Object.entries(value)
            .map(([k, v]) => `  ${k}: ${this.formatValue(v)}`)
            .join('\n')}`
        : '[Object]';
    }

    return String(value);
  }

  configure(config: FormatterConfig & { detailed?: boolean }): void {
    if (config.detailed !== undefined) this.detailed = config.detailed;
  }

  getSupportedFormats(): FormatType[] {
    return ['text', 'minimal'];
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
