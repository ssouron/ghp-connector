/**
 * Unit tests for FormatterRegistry
 */

import { FormatterRegistry } from './registry';
import { IFormatter, FormatType } from './base';
import { UnsupportedFormatError } from './errors';

// Create mock formatter for testing
class MockFormatter implements IFormatter {
  constructor(private formats: FormatType[] = ['json']) {}

  format(data: any): string {
    return JSON.stringify(data);
  }

  supports(_data: any): boolean {
    return true;
  }

  getSupportedFormats(): FormatType[] {
    return this.formats;
  }
}

describe('FormatterRegistry', () => {
  let registry: FormatterRegistry;
  let jsonFormatter: IFormatter;
  let textFormatter: IFormatter;
  let multiFormatter: IFormatter;

  beforeEach(() => {
    registry = new FormatterRegistry();
    jsonFormatter = new MockFormatter(['json']);
    textFormatter = new MockFormatter(['text']);
    multiFormatter = new MockFormatter(['table', 'csv']);
  });

  describe('register', () => {
    it('should register a formatter for all its supported formats', () => {
      registry.register(multiFormatter);

      expect(registry.hasFormatter('table')).toBe(true);
      expect(registry.hasFormatter('csv')).toBe(true);
      expect(registry.getFormatter('table')).toBe(multiFormatter);
      expect(registry.getFormatter('csv')).toBe(multiFormatter);
    });
  });

  describe('registerForFormat', () => {
    it('should register a formatter for a specific format', () => {
      registry.registerForFormat('json', jsonFormatter);

      expect(registry.hasFormatter('json')).toBe(true);
      expect(registry.getFormatter('json')).toBe(jsonFormatter);
    });

    it('should override previously registered formatter for the same format', () => {
      registry.registerForFormat('json', jsonFormatter);
      registry.registerForFormat('json', textFormatter);

      expect(registry.getFormatter('json')).toBe(textFormatter);
    });
  });

  describe('getFormatter', () => {
    it('should return the formatter for a registered format', () => {
      registry.register(jsonFormatter);

      expect(registry.getFormatter('json')).toBe(jsonFormatter);
    });

    it('should throw UnsupportedFormatError for an unregistered format', () => {
      expect(() => registry.getFormatter('csv')).toThrow(UnsupportedFormatError);
      expect(() => registry.getFormatter('csv')).toThrow('Unsupported format: csv');
    });
  });

  describe('hasFormatter', () => {
    it('should return true for registered formats', () => {
      registry.register(jsonFormatter);
      registry.register(textFormatter);

      expect(registry.hasFormatter('json')).toBe(true);
      expect(registry.hasFormatter('text')).toBe(true);
    });

    it('should return false for unregistered formats', () => {
      expect(registry.hasFormatter('csv')).toBe(false);
    });
  });

  describe('getDefaultFormatter', () => {
    it('should return the formatter for the default format', () => {
      registry.registerForFormat('human', jsonFormatter);

      expect(registry.getDefaultFormatter()).toBe(jsonFormatter);
    });

    it('should throw UnsupportedFormatError if default format is not registered', () => {
      expect(() => registry.getDefaultFormatter()).toThrow(UnsupportedFormatError);
    });
  });

  describe('setDefaultFormat', () => {
    it('should set the default format', () => {
      registry.register(jsonFormatter);
      registry.setDefaultFormat('json');

      expect(registry.getDefaultFormat()).toBe('json');
      expect(registry.getDefaultFormatter()).toBe(jsonFormatter);
    });

    it('should throw UnsupportedFormatError for an unregistered format', () => {
      expect(() => registry.setDefaultFormat('csv')).toThrow(UnsupportedFormatError);
    });
  });

  describe('getRegisteredFormats', () => {
    it('should return all registered format types', () => {
      registry.register(jsonFormatter);
      registry.register(multiFormatter);

      const formats = registry.getRegisteredFormats();
      expect(formats).toContain('json');
      expect(formats).toContain('table');
      expect(formats).toContain('csv');
      expect(formats.length).toBe(3);
    });

    it('should return an empty array when no formatters are registered', () => {
      expect(registry.getRegisteredFormats()).toEqual([]);
    });
  });

  describe('clear', () => {
    it('should remove all registered formatters', () => {
      registry.register(jsonFormatter);
      registry.register(textFormatter);
      registry.clear();

      expect(registry.getRegisteredFormats()).toEqual([]);
      expect(registry.hasFormatter('json')).toBe(false);
      expect(registry.hasFormatter('text')).toBe(false);
    });
  });
});
