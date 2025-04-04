import { JsonFormatter } from './JsonFormatter';

describe('JsonFormatter', () => {
  it('should format data as compact JSON by default', () => {
    const formatter = new JsonFormatter();
    const data = { b: 2, a: 1 };
    const expected = '{"a":1,"b":2}'; // Keys sorted
    expect(formatter.format(data)).toBe(expected);
  });

  it('should format data as pretty JSON when pretty option is true', () => {
    const formatter = new JsonFormatter({ pretty: true });
    const data = { b: 2, a: 1 };
    const expected = '{\n  "a": 1,\n  "b": 2\n}'; // Keys sorted, default indent 2
    expect(formatter.format(data)).toBe(expected);
  });

  it('should use custom indentation when provided', () => {
    const formatter = new JsonFormatter({ pretty: true, indent: 4 });
    const data = { b: 2, a: 1 };
    const expected = '{\n    "a": 1,\n    "b": 2\n}'; // Keys sorted, indent 4
    expect(formatter.format(data)).toBe(expected);
  });

  it('should handle nested objects and sort keys recursively', () => {
    const formatter = new JsonFormatter({ pretty: true });
    const data = { c: 3, a: 1, b: { z: 26, y: 25 } };
    const expected = '{\n  "a": 1,\n  "b": {\n    "y": 25,\n    "z": 26\n  },\n  "c": 3\n}';
    expect(formatter.format(data)).toBe(expected);
  });

  it('should handle arrays and sort keys within objects in arrays', () => {
    const formatter = new JsonFormatter({ pretty: true });
    const data = [
      { b: 2, a: 1 },
      { d: 4, c: 3 },
    ];
    const expected = '[\n  {\n    "a": 1,\n    "b": 2\n  },\n  {\n    "c": 3,\n    "d": 4\n  }\n]';
    expect(formatter.format(data)).toBe(expected);
  });

  it('should handle circular references', () => {
    const formatter = new JsonFormatter();
    const obj: any = { a: 1 };
    obj.b = obj; // Create circular reference
    const expected = '{"a":1,"b":"[Circular]"}';
    expect(formatter.format(obj)).toBe(expected);
  });

  it('should handle primitive types correctly', () => {
    const formatter = new JsonFormatter();
    expect(formatter.format(123)).toBe('123');
    expect(formatter.format('hello')).toBe('"hello"');
    expect(formatter.format(true)).toBe('true');
    expect(formatter.format(null)).toBe('null');
    // Note: JSON.stringify converts undefined in objects/arrays, but returns undefined for top-level undefined
    expect(formatter.format(undefined)).toBeUndefined();
  });

  it('should prioritize compact option over pretty', () => {
    // Compact true, pretty true -> compact wins
    const formatter = new JsonFormatter({ compact: true, pretty: true, indent: 4 });
    const data = { b: 2, a: 1 };
    expect(formatter.format(data)).toBe('{"a":1,"b":2}');
  });

  it('should default to compact if neither compact nor pretty is specified', () => {
    const formatter = new JsonFormatter({}); // Explicitly empty options
    const data = { b: 2, a: 1 };
    expect(formatter.format(data)).toBe('{"a":1,"b":2}');
  });

  it('should update options using the configure method', () => {
    const formatter = new JsonFormatter();
    const data = { b: 2, a: 1 };
    expect(formatter.format(data)).toBe('{"a":1,"b":2}'); // Compact initially

    formatter.configure({ pretty: true, indent: 3 });
    const expectedPretty = '{\n   "a": 1,\n   "b": 2\n}'; // Indent 3
    expect(formatter.format(data)).toBe(expectedPretty);

    formatter.configure({ pretty: false });
    expect(formatter.format(data)).toBe('{"a":1,"b":2}'); // Back to compact

    formatter.configure({ compact: true }); // Set compact
    expect(formatter.format(data)).toBe('{"a":1,"b":2}');

    formatter.configure({ compact: false, pretty: true }); // Unset compact, set pretty
    const expectedIndent3 = '{\n   "a": 1,\n   "b": 2\n}'; // Expect indent 3
    expect(formatter.format(data)).toBe(expectedIndent3); // Corrected expectation
  });

  // Add more tests later for edge cases, specific data types (Dates), and potential errors
});
