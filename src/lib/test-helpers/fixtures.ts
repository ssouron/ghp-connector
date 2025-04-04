/**
 * Formatter Test Fixtures
 * Reusable test data structures for formatter tests
 */

import { generateMockIssue, generateMockIssues, generateCircularData } from './mock-data';

/**
 * Common test fixtures for formatters
 */
export const FormatterFixtures = {
  /**
   * Empty values for testing edge cases
   */
  emptyValues: {
    emptyString: '',
    emptyArray: [],
    emptyObject: {},
    nullValue: null,
    undefinedValue: undefined,
  },

  /**
   * Primitive values for basic tests
   */
  primitives: {
    string: 'Hello, world!',
    number: 42,
    boolean: true,
    zero: 0,
    false: false,
    date: new Date('2023-01-15T12:30:45Z'),
  },

  /**
   * Special values that may cause formatting issues
   */
  specialValues: {
    nan: NaN,
    infinity: Infinity,
    negativeInfinity: -Infinity,
    // JSON doesn't support these directly, but formatters should handle them
  },

  /**
   * Special characters that may need escaping
   */
  specialCharacters: {
    quotes: 'String with "double" and \'single\' quotes',
    newlines: 'Line 1\nLine 2\r\nWindows line',
    tabs: 'Tab\tcharacter',
    backslashes: 'Backslash \\ character',
    controlChars: '\u0000\u0001\u0002\u0003', // NULL, SOH, STX, ETX
    unicode: 'Unicode: こんにちは世界 你好世界 안녕하세요 мир',
    emoji: 'Emoji: 😀 🚀 👍 🌍 🎉',
  },

  /**
   * Nested data structures
   */
  nested: {
    simpleNested: {
      level1: {
        level2: {
          level3: 'Deep value',
        },
      },
    },
    arrayOfObjects: [
      { id: 1, name: 'Item 1' },
      { id: 2, name: 'Item 2' },
      { id: 3, name: 'Item 3' },
    ],
    objectWithArrays: {
      numbers: [1, 2, 3, 4, 5],
      strings: ['a', 'b', 'c'],
      mixed: [1, 'two', true, { key: 'value' }],
    },
  },

  /**
   * Common GitHub data structures
   */
  github: {
    singleIssue: generateMockIssue(123, {
      title: 'Test issue for formatting',
      state: 'open',
    }),
    multipleIssues: generateMockIssues(5),
    circularData: generateCircularData(),
  },

  /**
   * Error scenarios
   */
  errors: {
    circularReference: generateCircularData(),
    veryLongString: 'a'.repeat(10000),
    deeplyNested: createDeeplyNestedObject(100),
  },

  /**
   * Performance test data
   */
  performance: {
    smallDataset: generateMockIssues(10),
    mediumDataset: generateMockIssues(100),
    largeDataset: generateMockIssues(500),
    veryLargeDataset: generateMockIssues(1000),
  },

  /**
   * Edge cases
   */
  edgeCases: {
    oneItemArray: ['single item'],
    objectWithNumericKeys: { '1': 'one', '2': 'two', '100': 'hundred' },
    arrayWithHoles: (() => {
      const arr = new Array(10);
      arr[0] = 'first';
      arr[5] = 'middle';
      arr[9] = 'last';
      return arr;
    })(),
    mixedTypes: [42, 'text', true, null, undefined, { key: 'value' }, [1, 2, 3]],
    maxSafeInteger: Number.MAX_SAFE_INTEGER,
    minSafeInteger: Number.MIN_SAFE_INTEGER,
  },
};

/**
 * Create a deeply nested object for testing
 * @param depth Depth of nesting
 * @returns Deeply nested object
 */
function createDeeplyNestedObject(depth: number): any {
  let obj: any = { value: 'Deep value' };

  for (let i = depth; i > 0; i--) {
    obj = { [`level${i}`]: obj };
  }

  return obj;
}

/**
 * Fixtures specifically for testing JSON formatter
 */
export const JsonFormatterFixtures = {
  ...FormatterFixtures,

  /**
   * JSON-specific test cases
   */
  specific: {
    prettyPrintTest: {
      nested: {
        object: {
          with: {
            many: {
              levels: true,
            },
          },
        },
      },
    },
    keySorting: {
      z: 'z comes last',
      a: 'a comes first',
      m: 'm in the middle',
    },
    validValues: {
      string: 'valid',
      number: 123,
      boolean: true,
      nullValue: null,
      array: [1, 2, 3],
      object: { a: 1 },
    },
    invalidValues: {
      function: () => 'test', // Functions aren't valid in JSON
      undefined: undefined,
      symbol: Symbol('test'),
      bigint: BigInt(123),
      nan: NaN,
      infinity: Infinity,
    },
  },
};

/**
 * Fixtures specifically for testing Text formatter
 */
export const TextFormatterFixtures = {
  ...FormatterFixtures,

  /**
   * Text-specific test cases
   */
  specific: {
    simpleObject: {
      id: 123,
      name: 'Test Item',
      description: 'This is a test description that should be formatted properly',
    },
    tableData: [
      { id: 1, name: 'Row 1', value: 100 },
      { id: 2, name: 'Row 2', value: 200 },
      { id: 3, name: 'Row 3', value: 300 },
    ],
    longStrings: {
      title: 'Short title',
      description:
        'This is a much longer description that should be wrapped when formatted with the text formatter. It contains multiple sentences and should demonstrate how the text formatter handles wrapping of long text content while maintaining readability.',
    },
  },
};

/**
 * Fixtures specifically for testing Human formatter
 */
export const HumanFormatterFixtures = {
  ...FormatterFixtures,

  /**
   * Human-specific test cases
   */
  specific: {
    statusData: {
      status: 'success',
      progress: 75,
      errors: 0,
      warnings: 2,
    },
    commandResult: {
      command: 'git push origin main',
      exitCode: 0,
      output: 'Everything up-to-date',
      duration: 1250, // ms
    },
    issueReport: {
      open: 42,
      closed: 156,
      totalComments: 534,
      averageResolutionTime: '3.5 days',
    },
  },
};
