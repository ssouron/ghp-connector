/**
 * Base formatter definitions
 * Provides core interfaces and types for the formatting system
 */

/**
 * Format types supported by the formatter system
 */
export type FormatType = 'json' | 'text' | 'table' | 'minimal' | 'human' | 'csv';

/**
 * Options passed to the formatter at runtime during the format() call.
 */
export interface FormatterRuntimeOptions {
  pretty?: boolean;
  indent?: number; // Note: number, conversion happens before calling format
  useColors?: boolean;
  timezone?: string;
  // Add other potential runtime options here
}

/**
 * Base formatter interface that all formatters must implement
 */
export interface IFormatter {
  /**
   * Format data into a string representation
   * @param data The data to format
   * @param options Optional runtime formatting options
   * @returns Formatted string
   */
  format(data: any, options?: FormatterRuntimeOptions): string;

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

  /**
   * Optional: Create a clone of the formatter instance.
   * Useful for factories to avoid mutating shared instances.
   * @returns A new instance with the same configuration.
   */
  clone?(): this;
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
   * @param options Optional runtime formatting options
   */
  abstract format(data: any, options?: FormatterRuntimeOptions): string;

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

  /**
   * Default clone implementation (returns the same instance).
   * Concrete formatters with state should override this.
   */
  clone(): this {
    // Basic implementation assuming no complex state to copy.
    // Subclasses like JsonFormatter should override this.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const constructor = this.constructor as any;
    // Create a new instance using the same constructor parameters if possible
    // This is a basic approach; might need refinement based on constructor args
    // For formatters like JsonFormatter with stateful options, override is necessary.
    return new constructor(this.formatType);
  }
}
