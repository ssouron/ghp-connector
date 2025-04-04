/**
 * Unit tests for formatter configuration
 */

import { validateConfig } from './config';

describe('Formatter Configuration', () => {
  describe('validateConfig', () => {
    it('should apply default configuration values', () => {
      const config = validateConfig(undefined, 'json');

      expect(config.useColors).toBe(true);
      expect(config.maxWidth).toBe(80);
    });

    it('should apply json format specific defaults', () => {
      const config = validateConfig(undefined, 'json');

      expect(config.indent).toBe(2);
      expect(config.sortKeys).toBe(false);
      expect(config.compact).toBe(false);
    });

    it('should apply table format specific defaults', () => {
      const config = validateConfig(undefined, 'table');

      expect(config.columns).toEqual([]);
      expect(config.headers).toEqual([]);
      expect(config.alignment).toEqual({});
    });

    it('should apply text format specific defaults', () => {
      const config = validateConfig(undefined, 'text');

      expect(config.detailed).toBe(false);
      expect(config.formatForTerminal).toBe(true);
    });

    it('should merge user configuration with defaults', () => {
      const userConfig = {
        useColors: false,
        maxWidth: 100,
      };

      const config = validateConfig(userConfig, 'json');

      expect(config.useColors).toBe(false);
      expect(config.maxWidth).toBe(100);
      expect(config.indent).toBe(2); // Default value preserved
    });

    it('should merge format-specific user config with defaults', () => {
      const userConfig = {
        indent: 4,
        sortKeys: true,
      };

      const config = validateConfig(userConfig, 'json');

      expect(config.useColors).toBe(true); // Default value preserved
      expect(config.indent).toBe(4);
      expect(config.sortKeys).toBe(true);
      expect(config.compact).toBe(false); // Default value preserved
    });

    it('should handle unknown formats', () => {
      const config = validateConfig(undefined, 'csv');

      // Should still have base config properties
      expect(config.useColors).toBe(true);
      expect(config.maxWidth).toBe(80);

      // But no format-specific properties
      expect(config).not.toHaveProperty('indent');
      expect(config).not.toHaveProperty('detailed');
      expect(config).not.toHaveProperty('columns');
    });
  });
});
