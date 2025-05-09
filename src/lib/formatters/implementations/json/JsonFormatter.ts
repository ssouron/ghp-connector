import { BaseFormatter, FormatterRuntimeOptions } from '../../base';
import { JsonFormatterOptions } from './types';
import { circularReferenceReplacer, sortObjectKeysRecursively } from './serializers';

export class JsonFormatter extends BaseFormatter {
  private options: JsonFormatterOptions;

  constructor(options: JsonFormatterOptions = {}) {
    super('json');
    this.options = { ...options };
  }

  format(data: unknown, runtimeOptions?: FormatterRuntimeOptions): string {
    // Fusionner les options de configuration avec les options d'exécution
    const mergedOptions = {
      ...this.options,
      ...(runtimeOptions || {}),
    };

    let indent: number | undefined;
    if (mergedOptions.compact === true) {
      indent = 0; // Compact overrides pretty and indent
    } else if (mergedOptions.pretty === true) {
      indent = mergedOptions.indent ?? 2; // Default indent is 2 only if pretty is explicitly true
    } else {
      indent = undefined; // Default is compact (undefined indent)
    }

    try {
      // 1. Sort keys for consistent output
      const sortedData = sortObjectKeysRecursively(data);
      // 2. Stringify with circular reference handling
      const jsonString = JSON.stringify(sortedData, circularReferenceReplacer(), indent);

      // Retourner simplement la chaîne JSON formatée
      return jsonString;
    } catch (error) {
      // Improved error handling can be added later
      if (error instanceof Error) {
        throw new Error(`JSON formatting failed: ${error.message}`);
      }
      throw new Error('JSON formatting failed due to an unknown error.');
    }
  }

  configure(options: JsonFormatterOptions): void {
    this.options = { ...this.options, ...options };
  }

  // We can keep the default supports() and getSupportedFormats() from BaseFormatter for now

  /**
   * Create a clone of this JsonFormatter instance.
   * Returns a new instance with a copy of the current options.
   */
  clone(): this {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const constructor = this.constructor as any;
    // Create a new instance and copy the options object
    return new constructor({ ...this.options });
  }
}
