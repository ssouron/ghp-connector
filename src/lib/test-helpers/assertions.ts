/**
 * Formatter Test Assertions
 * Format-specific assertion functions for testing output formatters
 */

import { FormatType } from '../formatters';
import { isValidJson } from './formatter-test-helpers';

/**
 * Assertions for JSON formatted output
 */
export const JsonAssertions = {
  /**
   * Assert that the output is valid JSON
   * @param output Formatted output to verify
   * @returns True if valid, throws error if not
   */
  isValid(output: string): boolean {
    if (!isValidJson(output)) {
      throw new Error(`Invalid JSON output: ${output}`);
    }
    return true;
  },

  /**
   * Assert that the JSON output contains expected key
   * @param output Formatted output
   * @param key Expected key
   * @returns True if valid, throws error if not
   */
  hasKey(output: string, key: string): boolean {
    try {
      const data = JSON.parse(output);
      if (!(key in data)) {
        throw new Error(`JSON output missing expected key: ${key}`);
      }
      return true;
    } catch (e) {
      throw new Error(`Error checking for key ${key}: ${(e as Error).message}`);
    }
  },

  /**
   * Assert that the JSON output contains expected value at key path
   * @param output Formatted output
   * @param path Path to value (dot notation, e.g. 'user.name')
   * @param expectedValue Value to check for
   * @returns True if valid, throws error if not
   */
  hasValueAtPath(output: string, path: string, expectedValue: any): boolean {
    try {
      const data = JSON.parse(output);
      const value = path.split('.').reduce((obj, key) => obj?.[key], data);

      if (value === undefined) {
        throw new Error(`JSON output missing value at path: ${path}`);
      }

      // Handle special cases like NaN or objects
      if (typeof expectedValue === 'object' && expectedValue !== null) {
        if (JSON.stringify(value) !== JSON.stringify(expectedValue)) {
          throw new Error(
            `JSON output has incorrect value at path ${path}. Expected ${JSON.stringify(expectedValue)}, got ${JSON.stringify(value)}`
          );
        }
      } else if (Number.isNaN(expectedValue)) {
        if (!Number.isNaN(value)) {
          throw new Error(`JSON output has incorrect value at path ${path}. Expected NaN, got ${value}`);
        }
      } else if (value !== expectedValue) {
        throw new Error(`JSON output has incorrect value at path ${path}. Expected ${expectedValue}, got ${value}`);
      }

      return true;
    } catch (e) {
      throw new Error(`Error checking value at path ${path}: ${(e as Error).message}`);
    }
  },

  /**
   * Assert that the formatted output is compact JSON (no whitespace)
   * @param output Formatted output to verify
   * @returns True if valid, throws error if not
   */
  isCompact(output: string): boolean {
    try {
      // Parse and re-stringify to normalize
      const normalizedCompact = JSON.stringify(JSON.parse(output));
      if (output !== normalizedCompact) {
        throw new Error(`JSON output is not compact: ${output}`);
      }
      return true;
    } catch (e) {
      throw new Error(`Error checking if JSON is compact: ${(e as Error).message}`);
    }
  },

  /**
   * Assert that the formatted output is pretty-printed JSON
   * @param output Formatted output to verify
   * @returns True if valid, throws error if not
   */
  isPretty(output: string): boolean {
    try {
      // A simple heuristic: pretty-printed JSON should contain newlines
      if (!output.includes('\n')) {
        throw new Error(`JSON output is not pretty-printed: ${output}`);
      }
      return true;
    } catch (e) {
      throw new Error(`Error checking if JSON is pretty-printed: ${(e as Error).message}`);
    }
  },

  /**
   * Assert that the formatted output has keys sorted alphabetically
   * @param output Formatted output to verify
   * @returns True if valid, throws error if not
   */
  hasKeysSorted(output: string): boolean {
    try {
      const data = JSON.parse(output);

      // Check only if it's an object, not an array or primitive
      if (typeof data === 'object' && data !== null && !Array.isArray(data)) {
        const keys = Object.keys(data);
        const sortedKeys = [...keys].sort();

        for (let i = 0; i < keys.length; i++) {
          if (keys[i] !== sortedKeys[i]) {
            throw new Error(
              `JSON output keys are not sorted. Expected: ${sortedKeys.join(', ')}, got: ${keys.join(', ')}`
            );
          }
        }
      }

      return true;
    } catch (e) {
      throw new Error(`Error checking if JSON keys are sorted: ${(e as Error).message}`);
    }
  },
};

/**
 * Assertions for Text and Human formatted output
 */
export const TextAssertions = {
  /**
   * Assert that the output contains expected text
   * @param output Formatted output to verify
   * @param expectedText Text to look for
   * @returns True if valid, throws error if not
   */
  contains(output: string, expectedText: string): boolean {
    if (!output.includes(expectedText)) {
      throw new Error(`Text output does not contain expected text: "${expectedText}"`);
    }
    return true;
  },

  /**
   * Assert that the output contains all of the specified strings
   * @param output Formatted output to verify
   * @param items Strings to look for
   * @returns True if valid, throws error if not
   */
  containsAll(output: string, items: string[]): boolean {
    const missing = items.filter((item) => !output.includes(item));
    if (missing.length > 0) {
      throw new Error(`Text output is missing expected items: ${missing.join(', ')}`);
    }
    return true;
  },

  /**
   * Assert that the output contains terminal color codes
   * @param output Formatted output to verify
   * @returns True if valid, throws error if not
   */
  hasColors(output: string): boolean {
    // ANSI color codes start with ESC (27 / 0x1B) followed by [
    const colorCodeRegex = /\u001b\[/;
    if (!colorCodeRegex.test(output)) {
      throw new Error('Text output does not contain color codes');
    }
    return true;
  },

  /**
   * Assert that the output does not contain terminal color codes
   * @param output Formatted output to verify
   * @returns True if valid, throws error if not
   */
  hasNoColors(output: string): boolean {
    const colorCodeRegex = /\u001b\[/;
    if (colorCodeRegex.test(output)) {
      throw new Error('Text output contains color codes but should not');
    }
    return true;
  },

  /**
   * Assert that the output contains structured key-value pairs
   * @param output Formatted output to verify
   * @param keys Keys to look for
   * @returns True if valid, throws error if not
   */
  hasKeys(output: string, keys: string[]): boolean {
    const missing = keys.filter((key) => {
      // Look for patterns like "key:" or "key ="
      const keyPattern = new RegExp(`${key}\\s*[=:]`, 'i');
      return !keyPattern.test(output);
    });

    if (missing.length > 0) {
      throw new Error(`Text output is missing expected keys: ${missing.join(', ')}`);
    }

    return true;
  },

  /**
   * Assert that the output has lines with maximum width
   * @param output Formatted output to verify
   * @param maxWidth Maximum width to check
   * @returns True if valid, throws error if not
   */
  respectsWidth(output: string, maxWidth: number): boolean {
    const lines = output.split('\n');
    const tooWide = lines.filter((line) => line.length > maxWidth);

    if (tooWide.length > 0) {
      throw new Error(`Text output has ${tooWide.length} lines exceeding maximum width of ${maxWidth}`);
    }

    return true;
  },
};

/**
 * Assertion utilities for checking cross-format consistency
 */
export const CrossFormatAssertions = {
  /**
   * Assert that two formats contain the same data fields
   * This is a simplistic check, and may need enhancement for complex cases
   * @param output1 First formatted output
   * @param output2 Second formatted output
   * @param format1 Format of the first output
   * @param format2 Format of the second output
   */
  containSameData(output1: string, output2: string, format1: FormatType, format2: FormatType): boolean {
    // For two JSON outputs, we can do a direct comparison after parsing
    if (format1 === 'json' && format2 === 'json') {
      try {
        const data1 = JSON.parse(output1);
        const data2 = JSON.parse(output2);

        // This is a simplistic check; could be enhanced for order-independence
        if (JSON.stringify(data1) !== JSON.stringify(data2)) {
          throw new Error('JSON outputs contain different data');
        }

        return true;
      } catch (e) {
        throw new Error(`Error comparing JSON outputs: ${(e as Error).message}`);
      }
    }

    // If one is JSON, extract keys and check if they appear in the other format
    if (format1 === 'json') {
      try {
        const data = JSON.parse(output1);
        const keys = Object.keys(data);

        const missing = keys.filter((key) => {
          // Look for the key in the text output (simple heuristic)
          return !output2.includes(key);
        });

        if (missing.length > 0) {
          throw new Error(`Format ${format2} is missing keys present in JSON: ${missing.join(', ')}`);
        }

        return true;
      } catch (e) {
        throw new Error(`Error comparing formats: ${(e as Error).message}`);
      }
    }

    if (format2 === 'json') {
      try {
        const data = JSON.parse(output2);
        const keys = Object.keys(data);

        const missing = keys.filter((key) => {
          return !output1.includes(key);
        });

        if (missing.length > 0) {
          throw new Error(`Format ${format1} is missing keys present in JSON: ${missing.join(', ')}`);
        }

        return true;
      } catch (e) {
        throw new Error(`Error comparing formats: ${(e as Error).message}`);
      }
    }

    // For two text formats, this is more challenging
    // We'll implement a basic check, but this could be enhanced
    const lines1 = output1.split('\n');
    const lines2 = output2.split('\n');

    if (Math.abs(lines1.length - lines2.length) > lines1.length * 0.5) {
      throw new Error(`Text formats have significantly different line counts: ${lines1.length} vs ${lines2.length}`);
    }

    return true;
  },
};
