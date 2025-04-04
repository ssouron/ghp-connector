/**
 * Unit tests for FormatterFactory
 */

import { FormatterFactory } from './factory';
import { FormatterRegistry } from './registry';
import { IFormatter, FormatType } from './base';
import { UnsupportedFormatError, FormattingError } from './errors';

// Étendre FormatType pour les tests
type TestFormatType = FormatType | 'error';

// Create a mock formatter that tracks configuration
class MockFormatter implements IFormatter {
  public lastConfig: any = null;

  constructor(
    private readonly formats: TestFormatType[] = ['json'],
    private readonly throwError: boolean = false
  ) {}

  format(data: any): string {
    if (this.throwError) {
      throw new FormattingError('Mock formatting error');
    }
    return JSON.stringify(data);
  }

  supports(_data: any): boolean {
    return true;
  }

  getSupportedFormats(): FormatType[] {
    return this.formats as FormatType[];
  }

  configure(config: any): void {
    this.lastConfig = config;
  }
}

describe('FormatterFactory', () => {
  let registry: FormatterRegistry;
  let factory: FormatterFactory;
  let jsonFormatter: MockFormatter;
  let textFormatter: MockFormatter;
  let errorFormatter: MockFormatter;

  beforeEach(() => {
    registry = new FormatterRegistry();
    jsonFormatter = new MockFormatter(['json']);
    textFormatter = new MockFormatter(['text']);
    errorFormatter = new MockFormatter(['error'], true);

    registry.registerForFormat('json', jsonFormatter);
    registry.registerForFormat('text', textFormatter);
    registry.registerForFormat('error' as FormatType, errorFormatter);
    registry.setDefaultFormat('json');

    factory = new FormatterFactory(registry);
  });

  describe('create', () => {
    it('should create a formatter for a valid format', () => {
      const formatter = factory.create('json');
      expect(formatter).toBe(jsonFormatter);
    });

    it('should throw UnsupportedFormatError for an unsupported format', () => {
      expect(() => factory.create('invalid' as FormatType)).toThrow(UnsupportedFormatError);
      expect(() => factory.create('invalid' as FormatType)).toThrow('Unsupported format: invalid');
    });

    it('should apply configuration when formatter has configure method', () => {
      const config = { useColors: false, indent: 4 };
      factory.create('json', config);

      expect(jsonFormatter.lastConfig).not.toBeNull();
      expect(jsonFormatter.lastConfig.useColors).toBe(false);
      expect(jsonFormatter.lastConfig.indent).toBe(4);
    });

    it('should handle formatters without configure method', () => {
      // Remove configure method from formatter
      const originalConfigure = jsonFormatter.configure;
      delete (jsonFormatter as any).configure;

      // Should not throw an error
      expect(() => factory.create('json', { useColors: false })).not.toThrow();

      // Restore configure method
      jsonFormatter.configure = originalConfigure;
    });
  });

  describe('createDefault', () => {
    it('should create the default formatter', () => {
      const formatter = factory.createDefault();
      expect(formatter).toBe(jsonFormatter);
    });

    it('should apply configuration to the default formatter', () => {
      const config = { useColors: false };
      factory.createDefault(config);

      expect(jsonFormatter.lastConfig).not.toBeNull();
      expect(jsonFormatter.lastConfig.useColors).toBe(false);
    });
  });

  describe('format', () => {
    it('should format data using the specified formatter', () => {
      const data = { id: 1, name: 'Test' };
      const result = factory.format(data, 'json');

      expect(result).toBe(JSON.stringify(data));
    });

    it('should apply configuration when formatting', () => {
      const data = { id: 1 };
      const config = { useColors: false };

      factory.format(data, 'json', config);

      expect(jsonFormatter.lastConfig).not.toBeNull();
      expect(jsonFormatter.lastConfig.useColors).toBe(false);
    });

    it('should catch and re-throw errors from formatters', () => {
      const data = { id: 1 };

      expect(() => factory.format(data, 'error' as FormatType)).toThrow(FormattingError);
      expect(() => factory.format(data, 'error' as FormatType)).toThrow(/Mock formatting error/);
    });
  });

  describe('formatWithDefault', () => {
    it('should format data using the default formatter', () => {
      const data = { id: 1, name: 'Test' };
      const result = factory.formatWithDefault(data);

      expect(result).toBe(JSON.stringify(data));
    });

    it('should apply configuration to the default formatter', () => {
      const data = { id: 1 };
      const config = { useColors: false };

      factory.formatWithDefault(data, config);

      expect(jsonFormatter.lastConfig).not.toBeNull();
      expect(jsonFormatter.lastConfig.useColors).toBe(false);
    });
  });
});
