/**
 * Formatter registry
 * Maintains a registry of available formatters
 */

import { IFormatter, FormatType } from './base';
import { UnsupportedFormatError } from './errors';

/**
 * Registry for formatters
 * Maintains a collection of formatters and provides lookup functionality
 */
export class FormatterRegistry {
  /**
   * Map of format types to formatters
   */
  private formatters = new Map<FormatType, IFormatter>();

  /**
   * Default format type to use when none is specified
   */
  private defaultFormat: FormatType = 'human';

  /**
   * Register a formatter for one or more format types
   * @param formatter The formatter to register
   */
  register(formatter: IFormatter): void {
    for (const format of formatter.getSupportedFormats()) {
      this.formatters.set(format, formatter);
    }
  }

  /**
   * Register a formatter for a specific format type
   * @param format Format type to register for
   * @param formatter The formatter to register
   */
  registerForFormat(format: FormatType, formatter: IFormatter): void {
    this.formatters.set(format, formatter);
  }

  /**
   * Get a formatter for the specified format type
   * @param format Format type to get a formatter for
   * @returns The formatter for the specified format
   * @throws UnsupportedFormatError if the format is not supported
   */
  getFormatter(format: FormatType): IFormatter {
    const formatter = this.formatters.get(format);
    if (!formatter) {
      throw new UnsupportedFormatError(format);
    }
    return formatter;
  }

  /**
   * Check if a formatter exists for the specified format type
   * @param format Format type to check
   * @returns True if a formatter exists, false otherwise
   */
  hasFormatter(format: FormatType): boolean {
    return this.formatters.has(format);
  }

  /**
   * Get the default formatter
   * @returns The default formatter
   * @throws UnsupportedFormatError if no default formatter is registered
   */
  getDefaultFormatter(): IFormatter {
    return this.getFormatter(this.defaultFormat);
  }

  /**
   * Set the default format type
   * @param format Format type to use as default
   * @throws UnsupportedFormatError if the format is not supported
   */
  setDefaultFormat(format: FormatType): void {
    if (!this.hasFormatter(format)) {
      throw new UnsupportedFormatError(format);
    }
    this.defaultFormat = format;
  }

  /**
   * Get the current default format type
   * @returns The default format type
   */
  getDefaultFormat(): FormatType {
    return this.defaultFormat;
  }

  /**
   * Get all registered format types
   * @returns Array of registered format types
   */
  getRegisteredFormats(): FormatType[] {
    return Array.from(this.formatters.keys());
  }

  /**
   * Clear all registered formatters
   */
  clear(): void {
    this.formatters.clear();
  }
}
