/**
 * Output formatters
 * Provides different formatters for CLI output
 */

/**
 * Format types supported by the formatter
 */
export type FormatType = 'json' | 'table' | 'minimal' | 'human';

/**
 * Base formatter interface
 */
export interface Formatter<T> {
  format(data: T): string;
}

/**
 * JSON formatter - outputs data as formatted JSON
 */
export class JsonFormatter<T> implements Formatter<T> {
  format(data: T): string {
    return JSON.stringify(data, null, 2);
  }
}

/**
 * Table formatter - outputs data as a table
 * Currently a stub implementation - will be enhanced later
 */
export class TableFormatter<T extends object[]> implements Formatter<T> {
  format(data: T): string {
    if (data.length === 0) {
      return 'No data to display';
    }
    
    // Simple table formatting using console.table
    // This is a placeholder - will be replaced with a proper table formatter
    return `${data.length} items\n`;
  }
}

/**
 * Minimal formatter - outputs only essential information
 * Useful for scripting or when only IDs are needed
 */
export class MinimalFormatter<T> implements Formatter<T> {
  format(data: T): string {
    if (Array.isArray(data)) {
      return this.formatArray(data);
    }
    
    if (typeof data === 'object' && data !== null) {
      return this.formatObject(data as Record<string, any>);
    }
    
    return String(data);
  }
  
  private formatArray(data: any[]): string {
    return data.map(item => {
      if (typeof item === 'object' && item !== null) {
        // For objects, try to get id or name
        if ('id' in item) return String(item.id);
        if ('number' in item) return String(item.number);
        if ('name' in item) return String(item.name);
        // If no identifiable property, return empty string
        return '';
      }
      return String(item);
    }).join('\n');
  }
  
  private formatObject(data: Record<string, any>): string {
    // For objects, try to get id or name
    if ('id' in data) return String(data.id);
    if ('number' in data) return String(data.number);
    if ('name' in data) return String(data.name);
    
    // If no identifiable property, return empty string
    return '';
  }
}

/**
 * Human-readable formatter - outputs data in a human-friendly format
 * This is the default formatter
 */
export class HumanFormatter<T> implements Formatter<T> {
  format(data: T): string {
    if (Array.isArray(data)) {
      return this.formatArray(data);
    }
    
    if (typeof data === 'object' && data !== null) {
      return this.formatObject(data as Record<string, any>);
    }
    
    return String(data);
  }
  
  private formatArray(data: any[]): string {
    if (data.length === 0) {
      return 'No items found';
    }
    
    return data.map(item => this.formatObject(item)).join('\n\n');
  }
  
  private formatObject(data: Record<string, any>): string {
    if (!data) return 'No data';
    
    // For GitHub issues, format nicely
    if ('title' in data && 'number' in data) {
      let result = `#${data.number} ${data.title}`;
      
      if (data.state) {
        result += ` [${data.state}]`;
      }
      
      if (data.body) {
        result += `\n\n${data.body}`;
      }
      
      return result;
    }
    
    // Default formatting for other object types
    return Object.entries(data)
      .filter(([, value]) => value !== undefined && value !== null)
      .map(([key, value]) => {
        if (typeof value === 'object' && !Array.isArray(value)) {
          return `${key}:\n  ${JSON.stringify(value, null, 2).replace(/\n/g, '\n  ')}`;
        }
        return `${key}: ${value}`;
      })
      .join('\n');
  }
}

/**
 * Create a formatter based on the specified format type
 */
export function createFormatter<T>(type: FormatType = 'human'): Formatter<T> {
  switch (type) {
    case 'json':
      return new JsonFormatter<T>();
    case 'table':
      return new TableFormatter<T extends object[] ? T : never>() as unknown as Formatter<T>;
    case 'minimal':
      return new MinimalFormatter<T>();
    case 'human':
    default:
      return new HumanFormatter<T>();
  }
}

/**
 * Format data according to the specified format type
 */
export function formatOutput<T>(data: T, type: FormatType = 'human'): string {
  const formatter = createFormatter<T>(type);
  return formatter.format(data);
} 