/**
 * Unit tests for formatters module
 */

import {
  FormatType,
  Formatter,
  JsonFormatter,
  TableFormatter,
  MinimalFormatter,
  HumanFormatter,
  createFormatter,
  formatOutput
} from './index';

describe('Formatters Module', () => {
  describe('JsonFormatter', () => {
    let formatter: JsonFormatter<any>;

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
  });

  describe('TableFormatter', () => {
    let formatter: TableFormatter<any[]>;

    beforeEach(() => {
      formatter = new TableFormatter();
    });

    it('should handle empty data correctly', () => {
      expect(formatter.format([])).toBe('No data to display');
    });

    it('should format array data with item count', () => {
      const data = [{ id: 1 }, { id: 2 }];
      expect(formatter.format(data)).toBe('2 items\n');
    });
  });

  describe('MinimalFormatter', () => {
    let formatter: MinimalFormatter<any>;

    beforeEach(() => {
      formatter = new MinimalFormatter();
    });

    it('should format primitive data correctly', () => {
      expect(formatter.format('test')).toBe('test');
      expect(formatter.format(123)).toBe('123');
      expect(formatter.format(true)).toBe('true');
    });

    it('should extract IDs from objects', () => {
      expect(formatter.format({ id: 123, name: 'Test Item' })).toBe('123');
    });

    it('should extract numbers from GitHub issues', () => {
      expect(formatter.format({ number: 42, title: 'Issue Title' })).toBe('42');
    });

    it('should extract names when ID is not available', () => {
      expect(formatter.format({ name: 'Test Name', description: 'Test Description' })).toBe('Test Name');
    });

    it('should handle arrays of objects by extracting identifiers', () => {
      const data = [
        { id: 1, name: 'Item 1' },
        { id: 2, name: 'Item 2' }
      ];
      expect(formatter.format(data)).toBe('1\n2');
    });

    it('should handle arrays with mixed identifier types', () => {
      const mixedData = [
        { id: 1 },
        { number: 2 },
        { name: 'Item 3' },
        { description: 'No identifier' }
      ];
      expect(formatter.format(mixedData)).toBe('1\n2\nItem 3\n');
    });

    it('should handle arrays of primitives', () => {
      expect(formatter.format([1, 2, 3])).toBe('1\n2\n3');
    });

    it('should return empty string for objects with no identifiable properties', () => {
      expect(formatter.format({ description: 'No ID or name' })).toBe('');
    });

    it('should handle empty data correctly', () => {
      expect(formatter.format([])).toBe('');
      expect(formatter.format({})).toBe('');
    });
  });

  describe('HumanFormatter', () => {
    let formatter: HumanFormatter<any>;

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

    it('should include body in GitHub issue formatting if available', () => {
      const issue = { 
        number: 42, 
        title: 'Bug fix', 
        state: 'open',
        body: 'This is a bug description'
      };
      expect(formatter.format(issue)).toBe('#42 Bug fix [open]\n\nThis is a bug description');
    });

    it('should format arrays of GitHub issues', () => {
      const issues = [
        { number: 1, title: 'First Issue', state: 'open' },
        { number: 2, title: 'Second Issue', state: 'closed' }
      ];
      expect(formatter.format(issues)).toBe('#1 First Issue [open]\n\n#2 Second Issue [closed]');
    });

    it('should show "No items found" for empty arrays', () => {
      expect(formatter.format([])).toBe('No items found');
    });

    it('should return "null" for null objects', () => {
      expect(formatter.format(null)).toBe('null');
    });

    it('should format generic objects with key-value pairs', () => {
      const data = { name: 'Test', count: 42 };
      expect(formatter.format(data)).toBe('name: Test\ncount: 42');
    });

    it('should handle nested objects', () => {
      const data = { 
        name: 'Parent',
        child: { name: 'Child', value: 123 }
      };
      expect(formatter.format(data)).toContain('name: Parent');
      expect(formatter.format(data)).toContain('child:');
      // Vérifier que le contenu est présent, peu importe le formatage exact
      expect(formatter.format(data)).toContain('Child');
      expect(formatter.format(data)).toContain('123');
    });

    it('should skip undefined and null values', () => {
      const data = {
        name: 'Test',
        description: undefined,
        value: null,
        count: 0
      };
      expect(formatter.format(data)).toBe('name: Test\ncount: 0');
    });
  });

  describe('createFormatter', () => {
    it('should create JsonFormatter when type is json', () => {
      const formatter = createFormatter<any>('json');
      expect(formatter).toBeInstanceOf(JsonFormatter);
    });

    it('should create TableFormatter when type is table', () => {
      const formatter = createFormatter<any[]>('table');
      expect(formatter).toBeInstanceOf(TableFormatter);
    });

    it('should create MinimalFormatter when type is minimal', () => {
      const formatter = createFormatter<any>('minimal');
      expect(formatter).toBeInstanceOf(MinimalFormatter);
    });

    it('should create HumanFormatter when type is human', () => {
      const formatter = createFormatter<any>('human');
      expect(formatter).toBeInstanceOf(HumanFormatter);
    });

    it('should create HumanFormatter by default', () => {
      const formatter = createFormatter<any>();
      expect(formatter).toBeInstanceOf(HumanFormatter);
    });
  });

  describe('formatOutput', () => {
    it('should format data using the specified formatter', () => {
      const data = { id: 123, name: 'Test' };
      expect(formatOutput(data, 'json')).toBe(JSON.stringify(data, null, 2));
      expect(formatOutput(data, 'minimal')).toBe('123');
      expect(formatOutput(data, 'human')).toBe('id: 123\nname: Test');
    });

    it('should use HumanFormatter by default', () => {
      const data = { id: 123, name: 'Test' };
      expect(formatOutput(data)).toBe('id: 123\nname: Test');
    });

    it('should handle large datasets', () => {
      const largeDataset = Array(100).fill(0).map((_, i) => ({ id: i, name: `Item ${i}` }));
      const jsonResult = formatOutput(largeDataset, 'json');
      const minimalResult = formatOutput(largeDataset, 'minimal');
      const humanResult = formatOutput(largeDataset, 'human');
      
      expect(jsonResult).toContain('"id": 0');
      expect(jsonResult).toContain('"id": 99');
      
      expect(minimalResult.split('\n').length).toBe(100);
      expect(minimalResult).toContain('0');
      expect(minimalResult).toContain('99');
      
      expect(humanResult).toContain('id: 0');
      expect(humanResult).toContain('id: 99');
    });

    it('should handle special characters in data', () => {
      const dataWithSpecialChars = {
        title: 'Special: "quotes", \'apostrophes\', &amp; more!',
        description: '< > & " \' \n \t \\ /'
      };
      
      // Test that each formatter properly handles special characters
      const jsonResult = formatOutput(dataWithSpecialChars, 'json');
      const humanResult = formatOutput(dataWithSpecialChars, 'human');
      
      expect(jsonResult).toContain('Special: \\"quotes\\"');
      expect(jsonResult).toContain('\'apostrophes\'');
      expect(jsonResult).toContain('&amp; more!');
      
      expect(humanResult).toContain('title: Special: "quotes", \'apostrophes\', &amp; more!');
      expect(humanResult).toContain('description: < > & " \' \n \t \\ /');
    });
  });
}); 