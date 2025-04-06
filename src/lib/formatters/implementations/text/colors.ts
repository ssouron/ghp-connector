/**
 * Text formatter color definitions
 * Defines color scheme for the text formatter
 */

import chalk from 'chalk';
import { ColorConfig } from './types';

/**
 * Default color configuration
 */
export const defaultColors: ColorConfig = {
  header: 'blue',
  header2: 'magenta', // Secondary header color for comment headers
  key: 'cyan',
  value: 'white',
  date: 'yellow',
  url: 'green',
  section: 'cyan', // Section headers for content categories
  status: {
    success: 'green',
    warning: 'yellow',
    error: 'red',
    info: 'blue',
  },
};

/**
 * Safely apply a chalk color
 * @param text Text to colorize
 * @param color Color to apply
 * @returns Colorized text
 */
function applyColor(text: string, color: string): string {
  // Check if color exists in chalk
  if (typeof (chalk as any)[color] === 'function') {
    return (chalk as any)[color](text);
  }
  return text;
}

/**
 * Apply colors to text based on the color configuration
 * @param text Text to colorize
 * @param colorType Type of color to apply
 * @param useColors Whether to use colors or not
 * @returns Colorized text
 */
export function colorize(
  text: string,
  colorType: keyof ColorConfig | 'status.success' | 'status.warning' | 'status.error' | 'status.info',
  useColors = true
): string {
  if (!useColors) {
    return text;
  }

  if (colorType.includes('.')) {
    const [section, subType] = colorType.split('.') as [keyof ColorConfig, string];
    if (section === 'status' && subType in defaultColors.status) {
      const color = defaultColors.status[subType as keyof typeof defaultColors.status];
      return applyColor(text, color);
    }
    return text;
  }

  const color = defaultColors[colorType as keyof ColorConfig];
  if (typeof color === 'string') {
    return applyColor(text, color);
  }

  return text;
}

/**
 * Format a status string with appropriate colors
 * @param status Status string
 * @param useColors Whether to use colors
 * @returns Colored status string
 */
export function formatStatus(status: string, useColors = true): string {
  if (!useColors) {
    return status;
  }

  const statusLower = status.toLowerCase();

  if (statusLower === 'open' || statusLower === 'success' || statusLower === 'active') {
    return colorize(status, 'status.success', useColors);
  }

  if (statusLower === 'closed' || statusLower === 'error' || statusLower === 'failure' || statusLower === 'inactive') {
    return colorize(status, 'status.error', useColors);
  }

  if (statusLower === 'warning' || statusLower === 'pending') {
    return colorize(status, 'status.warning', useColors);
  }

  return colorize(status, 'status.info', useColors);
}
