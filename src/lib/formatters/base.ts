/**
 * Base formatter definitions
 * Provides core interfaces and types for the formatting system
 */

/**
 * Format types supported by the formatter system
 */
export type FormatType = 'json' | 'text' | 'table' | 'minimal' | 'human' | 'csv';

/**
 * Base formatter interface that all formatters must implement
 */
export interface IFormatter {
  /**
   * Format data into a string representation
   * @param data The data to format
   * @returns Formatted string
   */
  format(data: any): string;

  /**
   * Check if this formatter supports the given data
   * @param data The data to check
   * @returns True if the formatter supports this data, false otherwise
   */
  supports(data: any): boolean;

  /**
   * Get the list of format types this formatter supports
   * @returns Array of supported format types
   */
  getSupportedFormats(): FormatType[];

  /**
   * Configure the formatter with specific options
   * @param config Configuration options
   */
  configure?(config: any): void;
}

/**
 * Abstract base class that implements common formatter functionality
 * Concrete formatters can extend this class for convenience
 */
export abstract class BaseFormatter implements IFormatter {
  /**
   * The format type this formatter handles
   */
  protected readonly formatType: FormatType;

  /**
   * Create a new formatter
   * @param formatType The format type this formatter handles
   */
  constructor(formatType: FormatType) {
    this.formatType = formatType;
  }

  /**
   * Format data into a string representation
   * Must be implemented by concrete formatters
   * @param data The data to format
   */
  abstract format(data: any): string;

  /**
   * Check if this formatter supports the given data
   * Default implementation returns true for all data
   * Can be overridden by concrete formatters for specific data validation
   * @param data The data to check
   */
  supports(_data: any): boolean {
    return true;
  }

  /**
   * Get the list of format types this formatter supports
   * Default implementation returns the format type provided in the constructor
   * @returns Array of supported format types
   */
  getSupportedFormats(): FormatType[] {
    return [this.formatType];
  }
}
