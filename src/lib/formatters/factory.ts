/**
 * Formatter factory
 * Creates formatter instances based on format type
 */

import { IFormatter, FormatType } from './base';
import { FormatterRegistry } from './registry';
import { FormatterConfigForType, validateConfig } from './config';
import { UnsupportedFormatError, FormattingError } from './errors';

/**
 * Factory for creating formatters
 */
export class FormatterFactory {
  /**
   * Create a new formatter factory
   * @param registry The formatter registry to use
   */
  constructor(private registry: FormatterRegistry) {}

  /**
   * Create a formatter for the specified format type
   * @param format Format type to create a formatter for
   * @param config Optional configuration for the formatter
   * @returns A formatter instance
   * @throws UnsupportedFormatError if the format is not supported
   */
  create<T extends FormatType>(format: T, config?: Partial<FormatterConfigForType<T>>): IFormatter {
    try {
      // Check if the format is supported
      if (!this.registry.hasFormatter(format)) {
        // If the format is not supported, throw an appropriate error
        throw new UnsupportedFormatError(format);
      }

      // Get the formatter from the registry
      const formatter = this.registry.getFormatter(format);

      // If the formatter has a configure method, call it with the validated config
      if ('configure' in formatter && typeof formatter.configure === 'function') {
        const validatedConfig = validateConfig(config, format);
        formatter.configure(validatedConfig);
      }

      return formatter;
    } catch (error) {
      // If the error is a UnsupportedFormatError, rethrow it directly
      if (error instanceof UnsupportedFormatError) {
        throw error;
      }

      // Otherwise, wrap it in a FormattingError
      throw new FormattingError(
        `Failed to create formatter for format '${format}': ${(error as Error).message}`,
        error as Error
      );
    }
  }

  /**
   * Create the default formatter
   * @param config Optional configuration for the formatter
   * @returns The default formatter
   */
  createDefault<T extends FormatType>(config?: Partial<FormatterConfigForType<T>>): IFormatter {
    const defaultFormat = this.registry.getDefaultFormat() as T;
    return this.create(defaultFormat, config);
  }

  /**
   * Format data using the specified format type
   * @param data Data to format
   * @param format Format type to use
   * @param config Optional configuration for the formatter
   * @returns Formatted string
   */
  format<T extends FormatType>(data: any, format: T, config?: Partial<FormatterConfigForType<T>>): string {
    try {
      const formatter = this.create(format, config);
      return formatter.format(data);
    } catch (error) {
      // If the error is already a FormattingError or a UnsupportedFormatError, rethrow it
      if (error instanceof FormattingError || error instanceof UnsupportedFormatError) {
        throw error;
      }

      // Otherwise, wrap it in a FormattingError
      throw new FormattingError(
        `Error formatting data with format '${format}': ${(error as Error).message}`,
        error as Error
      );
    }
  }

  /**
   * Format data using the default formatter
   * @param data Data to format
   * @param config Optional configuration for the formatter
   * @returns Formatted string
   */
  formatWithDefault<T extends FormatType>(data: any, config?: Partial<FormatterConfigForType<T>>): string {
    const formatter = this.createDefault(config);
    return formatter.format(data);
  }
}
