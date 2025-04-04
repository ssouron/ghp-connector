/**
 * Formatter Test Helpers
 * Utility functions for testing formatters
 */

import { IFormatter, FormatType, FormatterRegistry, FormatterFactory } from '../formatters';
import { JsonFormatter } from '../formatters/implementations/json';
import { TextFormatter } from '../formatters/implementations/text';
import { HumanFormatter } from '../formatters';

/**
 * Mock formatter that implements the IFormatter interface for testing
 */
export class MockFormatter implements IFormatter {
  public lastData: any = null;
  public lastConfig: any = null;
  public formatCallCount = 0;
  public configureCallCount = 0;
  public returnValue: string = '';

  constructor(
    private readonly formats: string[] = ['test'],
    private readonly throwError: boolean = false,
    private readonly errorMessage: string = 'Mock formatting error'
  ) {}

  format(data: any): string {
    this.formatCallCount++;
    this.lastData = data;

    if (this.throwError) {
      throw new Error(this.errorMessage);
    }

    return this.returnValue || JSON.stringify(data);
  }

  supports(_data: any): boolean {
    return true;
  }

  getSupportedFormats(): FormatType[] {
    return this.formats as FormatType[];
  }

  configure(config: any): void {
    this.configureCallCount++;
    this.lastConfig = config;
  }

  /**
   * Reset mock statistics
   */
  reset(): void {
    this.lastData = null;
    this.lastConfig = null;
    this.formatCallCount = 0;
    this.configureCallCount = 0;
  }

  /**
   * Set the return value for the format method
   */
  setReturnValue(value: string): void {
    this.returnValue = value;
  }
}

/**
 * Creates a test registry with mock formatters
 */
export function createTestRegistry(): {
  registry: FormatterRegistry;
  jsonFormatter: MockFormatter;
  textFormatter: MockFormatter;
  humanFormatter: MockFormatter;
} {
  const registry = new FormatterRegistry();
  const jsonFormatter = new MockFormatter(['json']);
  const textFormatter = new MockFormatter(['text']);
  const humanFormatter = new MockFormatter(['human']);

  registry.registerForFormat('json', jsonFormatter);
  registry.registerForFormat('text', textFormatter);
  registry.registerForFormat('human', humanFormatter);
  registry.setDefaultFormat('human');

  return {
    registry,
    jsonFormatter,
    textFormatter,
    humanFormatter,
  };
}

/**
 * Creates a test factory with mock formatters
 */
export function createTestFactory(): {
  factory: FormatterFactory;
  jsonFormatter: MockFormatter;
  textFormatter: MockFormatter;
  humanFormatter: MockFormatter;
} {
  const { registry, jsonFormatter, textFormatter, humanFormatter } = createTestRegistry();
  const factory = new FormatterFactory(registry);

  return {
    factory,
    jsonFormatter,
    textFormatter,
    humanFormatter,
  };
}

/**
 * Creates a real registry with actual formatter implementations
 */
export function createRealRegistry(): FormatterRegistry {
  const registry = new FormatterRegistry();
  registry.register(new JsonFormatter());
  registry.register(new TextFormatter());
  registry.register(new HumanFormatter());
  registry.setDefaultFormat('human');
  return registry;
}

/**
 * Creates a real factory with actual formatter implementations
 */
export function createRealFactory(): FormatterFactory {
  return new FormatterFactory(createRealRegistry());
}

/**
 * Verifies that formatted output is valid JSON
 */
export function isValidJson(str: string): boolean {
  try {
    JSON.parse(str);
    return true;
  } catch (e) {
    return false;
  }
}

/**
 * Verifies that two formatted outputs contain the same data
 * @param output1 First formatted output
 * @param output2 Second formatted output
 * @param format1 Format of the first output
 * @param format2 Format of the second output
 */
export function outputsContainSameData(
  output1: string,
  output2: string,
  format1: FormatType = 'json',
  format2: FormatType = 'json'
): boolean {
  // For JSON outputs, we can simply parse them
  if (format1 === 'json' && format2 === 'json') {
    try {
      const data1 = JSON.parse(output1);
      const data2 = JSON.parse(output2);
      return JSON.stringify(data1) === JSON.stringify(data2);
    } catch (e) {
      return false;
    }
  }

  // For mixed formats, convert text/human to basic object representation
  // This is a simplified approach - real implementation would need more complex parsing
  if (format1 === 'json') {
    try {
      const data1 = JSON.parse(output1);
      return output2.includes(String(data1));
    } catch (e) {
      return false;
    }
  }

  if (format2 === 'json') {
    try {
      const data2 = JSON.parse(output2);
      return output1.includes(String(data2));
    } catch (e) {
      return false;
    }
  }

  // For text/human formats, this is a simplistic check
  // Real implementation would need format-specific parsing
  return output1.includes(output2) || output2.includes(output1);
}

// Custom Jest matcher for formatter outputs
expect.extend({
  /**
   * Custom matcher to verify JSON output format
   */
  toBeValidJson(received: string) {
    const pass = isValidJson(received);
    return {
      message: () => (pass ? `Expected ${received} not to be valid JSON` : `Expected ${received} to be valid JSON`),
      pass,
    };
  },

  /**
   * Custom matcher to verify that outputs contain the same data
   */
  toContainSameDataAs(
    received: string,
    expected: string,
    receivedFormat: FormatType = 'json',
    expectedFormat: FormatType = 'json'
  ) {
    const pass = outputsContainSameData(received, expected, receivedFormat, expectedFormat);
    return {
      message: () =>
        pass
          ? `Expected formatted outputs to contain different data`
          : `Expected formatted outputs to contain the same data`,
      pass,
    };
  },
});

// Extend Jest matchers
declare global {
  namespace jest {
    interface Matchers<R> {
      toBeValidJson(): R;
      toContainSameDataAs(expected: string, receivedFormat?: FormatType, expectedFormat?: FormatType): R;
    }
  }
}
