/**
 * Formatter-specific error types
 * Provides error classes for the formatting system
 */

import { GHPError, ExitCode } from '../errors';

/**
 * Base error class for formatter errors
 */
export class FormatterError extends GHPError {
  constructor(message: string) {
    super(message, ExitCode.GeneralError);
  }
}

/**
 * Error thrown when a format is not supported
 */
export class UnsupportedFormatError extends FormatterError {
  constructor(format: string) {
    super(`Unsupported format: ${format}`);
  }
}

/**
 * Error thrown when formatting fails
 */
export class FormattingError extends FormatterError {
  constructor(
    message: string,
    public readonly originalError?: Error
  ) {
    super(`Error formatting data: ${message}`);
  }
}

/**
 * Error thrown when a formatter configuration is invalid
 */
export class FormatterConfigurationError extends FormatterError {
  constructor(message: string) {
    super(`Invalid formatter configuration: ${message}`);
  }
}
