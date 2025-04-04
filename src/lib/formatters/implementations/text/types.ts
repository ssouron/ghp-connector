/**
 * Text formatter types
 * Defines types and interfaces for the text formatter implementation
 */

/**
 * Configuration options for the text formatter
 */
export interface TextFormatterOptions {
  /**
   * Whether to use colors in the output
   * @default true
   */
  useColors?: boolean;

  /**
   * Date format to use
   * 'ISO' | 'local' | 'relative'
   * @default 'local'
   */
  dateFormat?: 'ISO' | 'local' | 'relative';

  /**
   * Timezone to use for date formatting
   * @default 'local'
   */
  timezone?: string;

  /**
   * Indentation level for nested objects
   * @default 2
   */
  indentSize?: number;

  /**
   * Whether to show detailed information
   * @default false
   */
  detailed?: boolean;
}

/**
 * Color configuration for different data types
 */
export interface ColorConfig {
  /**
   * Color for headers and titles
   */
  header: string;

  /**
   * Color for keys/labels
   */
  key: string;

  /**
   * Color for values
   */
  value: string;

  /**
   * Color for dates and times
   */
  date: string;

  /**
   * Color for URLs
   */
  url: string;

  /**
   * Color for status indicators
   */
  status: {
    /**
     * Color for success/open status
     */
    success: string;

    /**
     * Color for warning status
     */
    warning: string;

    /**
     * Color for error/closed status
     */
    error: string;

    /**
     * Color for info/neutral status
     */
    info: string;
  };
}
