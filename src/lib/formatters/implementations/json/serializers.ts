/**
 * Custom replacer function for JSON.stringify to handle circular references.
 */
export function circularReferenceReplacer() {
  const cache = new Set();
  return (key: string, value: unknown) => {
    if (typeof value === 'object' && value !== null) {
      if (cache.has(value)) {
        // Circular reference found, discard key
        return '[Circular]'; // Or return undefined to omit the key entirely
      }
      // Store value in our collection
      cache.add(value);
    }
    return value;
  };
}

/**
 * Recursively sorts object keys alphabetically.
 * This ensures consistent output for JSON stringification.
 * Handles nested objects and arrays, and detects circular references.
 */
export function sortObjectKeysRecursively(obj: unknown, visited = new Set<unknown>()): unknown {
  if (typeof obj !== 'object' || obj === null) {
    return obj; // Not an object or array, return as is
  }

  // --- Circular reference detection ---
  if (visited.has(obj)) {
    return '[Circular]'; // Return placeholder if already visited
  }
  visited.add(obj);
  // ----------------------------------

  if (Array.isArray(obj)) {
    // If it's an array, recursively sort elements
    // Need to pass the visited set down
    return obj.map((item) => sortObjectKeysRecursively(item, new Set(visited)));
  }

  // It's an object, sort its keys
  const sortedKeys = Object.keys(obj).sort();
  const sortedObj: { [key: string]: unknown } = {};

  for (const key of sortedKeys) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    // Need to pass the visited set down
    sortedObj[key] = sortObjectKeysRecursively((obj as any)[key], new Set(visited));
  }

  // Remove the object from visited set when returning up the stack
  // (This might not be strictly necessary if we always create new sets downwards,
  // but good practice if we were modifying the set in place)
  // visited.delete(obj); // Removed for simplicity with new Set creation

  return sortedObj;
}
