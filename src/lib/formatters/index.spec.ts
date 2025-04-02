/**
 * Unit tests for formatters module
 */

import { JsonFormatter, TextFormatter, HumanFormatter, formatOutput, defaultRegistry, defaultFactory } from './index';

describe('Formatters Module', () => {
  describe('JsonFormatter', () => {
    let formatter: JsonFormatter;

    beforeEach(() => {
      formatter = new JsonFormatter();
    });

    it('should format primitive data correctly', () => {
      expect(formatter.format('test')).toBe('"test"');
      expect(formatter.format(123)).toBe('123');
      expect(formatter.format(true)).toBe('true');
    });

    it('should format object data with proper indentation', () => {
      const data = { id: 1, name: 'Test Item' };
      const expected = JSON.stringify(data, null, 2);
      expect(formatter.format(data)).toBe(expected);
    });

    it('should format array data correctly', () => {
      const data = [{ id: 1 }, { id: 2 }];
      const expected = JSON.stringify(data, null, 2);
      expect(formatter.format(data)).toBe(expected);
    });

    it('should handle empty data correctly', () => {
      expect(formatter.format([])).toBe('[]');
      expect(formatter.format({})).toBe('{}');
      expect(formatter.format(null)).toBe('null');
    });

    it('should respect configuration options', () => {
      formatter.configure({
        indent: 4,
        compact: false,
        sortKeys: false,
      });

      const data = { id: 1, name: 'Test' };
      const expected = JSON.stringify(data, null, 4);
      expect(formatter.format(data)).toBe(expected);

      formatter.configure({
        indent: 0,
        compact: true,
      });

      const compactExpected = JSON.stringify(data);
      expect(formatter.format(data)).toBe(compactExpected);
    });
  });

  describe('TextFormatter', () => {
    let formatter: TextFormatter;

    beforeEach(() => {
      formatter = new TextFormatter();
    });

    it('should handle empty data correctly', () => {
      expect(formatter.format([])).toBe('No items.');
    });

    it('should format simple objects', () => {
      const data = { id: 1, name: 'Test' };
      expect(formatter.format(data)).toContain('id: 1');
      expect(formatter.format(data)).toContain('name: Test');
    });

    it('should format GitHub issues specially', () => {
      const issue = { number: 42, title: 'Bug fix', state: 'open' };
      expect(formatter.format(issue)).toBe('#42 Bug fix [open]');
    });

    it('should support detailed mode', () => {
      formatter.configure({ detailed: true });

      const issue = {
        number: 42,
        title: 'Bug fix',
        state: 'open',
        body: 'This is a bug description',
      };

      expect(formatter.format(issue)).toContain('This is a bug description');
    });
  });

  describe('HumanFormatter', () => {
    let formatter: HumanFormatter;

    beforeEach(() => {
      formatter = new HumanFormatter();
    });

    it('should format primitive data correctly', () => {
      expect(formatter.format('test')).toBe('test');
      expect(formatter.format(123)).toBe('123');
      expect(formatter.format(true)).toBe('true');
    });

    it('should format GitHub issues with title and number', () => {
      const issue = { number: 42, title: 'Bug fix', state: 'open' };
      expect(formatter.format(issue)).toBe('#42 Bug fix [open]');
    });

    it('should include body in GitHub issue formatting if enabled', () => {
      formatter.configure({ detailed: true });

      const issue = {
        number: 42,
        title: 'Bug fix',
        state: 'open',
        body: 'This is a bug description',
      };

      expect(formatter.format(issue)).toContain('This is a bug description');
    });

    it('should format arrays of GitHub issues', () => {
      const issues = [
        { number: 1, title: 'First Issue', state: 'open' },
        { number: 2, title: 'Second Issue', state: 'closed' },
      ];

      const result = formatter.format(issues);
      expect(result).toContain('#1 First Issue [open]');
      expect(result).toContain('#2 Second Issue [closed]');
    });

    it('should show a message for empty arrays', () => {
      expect(formatter.format([])).toBe('No items.');
    });

    it('should handle null values', () => {
      expect(formatter.format(null)).toBe('');
    });

    it('should format generic objects with key-value pairs', () => {
      const data = { name: 'Test', count: 42 };
      const result = formatter.format(data);
      expect(result).toContain('name: Test');
      expect(result).toContain('count: 42');
    });
  });

  describe('Registry and Factory', () => {
    it('should have registered formatters', () => {
      expect(defaultRegistry.hasFormatter('json')).toBe(true);
      expect(defaultRegistry.hasFormatter('text')).toBe(true);
      expect(defaultRegistry.hasFormatter('human')).toBe(true);
    });

    it('should create formatters from the factory', () => {
      const jsonFormatter = defaultFactory.create('json');
      expect(jsonFormatter).toBeInstanceOf(JsonFormatter);

      const textFormatter = defaultFactory.create('text');
      expect(textFormatter).toBeInstanceOf(TextFormatter);

      const humanFormatter = defaultFactory.create('human');
      expect(humanFormatter).toBeInstanceOf(HumanFormatter);
    });
  });

  describe('formatOutput', () => {
    it('should format data using the specified formatter', () => {
      const data = { id: 123, name: 'Test' };
      expect(formatOutput(data, 'json')).toBe(JSON.stringify(data, null, 2));

      const textResult = formatOutput(data, 'text');
      expect(textResult).toContain('id: 123');
      expect(textResult).toContain('name: Test');

      const humanResult = formatOutput(data, 'human');
      expect(humanResult).toContain('id: 123');
      expect(humanResult).toContain('name: Test');
    });

    it('should use human formatter by default', () => {
      const data = { id: 42, name: 'Default Test' };
      const defaultResult = formatOutput(data);
      const humanResult = formatOutput(data, 'human');

      expect(defaultResult).toBe(humanResult);
    });

    it('should handle custom configuration', () => {
      const data = { id: 123, deep: { nested: 'value' } };

      const result = formatOutput(data, 'json', { indent: 4 });
      expect(result).toBe(JSON.stringify(data, null, 4));

      const detailedResult = formatOutput(data, 'text', { detailed: true });
      expect(detailedResult).toContain('nested: value');
    });

    it('should handle large datasets', () => {
      // Create a large dataset
      const largeData = Array.from({ length: 100 }, (_, i) => ({ id: i, name: `Item ${i}` }));

      // Test with different formatters
      const jsonResult = formatOutput(largeData, 'json');
      expect(jsonResult).toContain('"id": 0');
      expect(jsonResult).toContain('"id": 99');

      // We're not testing minimal formatter specifically anymore
      const textResult = formatOutput(largeData, 'text');
      expect(textResult).toContain('id: 0');
      expect(textResult).toContain('id: 99');
    });
  });
});
