import { FormatType } from '../lib/formatters';

/**
 * Interface describing the format-related options expected after parsing.
 */
export interface FormatValidationOptions {
  format: FormatType;
  pretty?: boolean;
  indent?: string; // Commander passes option arguments as strings
  noColor?: boolean;
  timezone?: string; // Keep for future use
  debug?: boolean; // Add debug flag
}

/**
 * Validates format-specific command line options combinations.
 * Throws an error with a user-friendly message if invalid combinations are detected.
 *
 * @param options - The parsed options object containing format-related flags.
 *                  It's expected to conform to the FormatValidationOptions interface.
 */
export function validateFormatOptions(options: FormatValidationOptions): void {
  const { format, pretty, indent, noColor } = options;
  const defaultIndent = '2'; // Default indent value defined in cli.ts

  // --- JSON Specific Validations ---
  if (format === 'json') {
    // --indent requires --pretty
    if (indent !== undefined && indent !== defaultIndent && !pretty) {
      throw new Error('--indent option requires --pretty to be set for JSON format.');
    }
    // Validate indent value is a non-negative integer
    if (indent !== undefined) {
      const indentNum = Number(indent);
      if (isNaN(indentNum) || !Number.isInteger(indentNum) || indentNum < 0) {
        throw new Error(`--indent must be a non-negative integer, received: ${indent}`);
      }
    }
  } else {
    // Options only valid for JSON
    if (pretty) {
      throw new Error(`--pretty option is only valid when --format is 'json'. Current format: '${format}'.`);
    }
    // Don't allow --indent if not JSON, unless it's the default value (which commander might pass even if user didn't specify)
    if (indent !== undefined && indent !== defaultIndent) {
      throw new Error(`--indent option is only valid when --format is 'json'. Current format: '${format}'.`);
    }
  }

  // --- Text/Human Specific Validations ---
  if (format !== 'text' && format !== 'human') {
    // --no-color is only relevant for text/human
    if (noColor) {
      // This is more of a warning/info, as it doesn't break anything technically.
      // Depending on strictness, we could throw an error or just ignore it.
      // Let's throw an error for consistency for now.
      throw new Error(`--no-color option is primarily for 'text' or 'human' formats. Current format: '${format}'.`);
    }
  }

  // --- Timezone Validation (Placeholder) ---
  // if (options.timezone) {
  //   try {
  //     // Example validation: Check if timezone is valid using Intl API
  //     Intl.DateTimeFormat(undefined, { timeZone: options.timezone });
  //   } catch (e) {
  //     throw new Error(`Invalid timezone specified: ${options.timezone}`);
  //   }
  // }
}
