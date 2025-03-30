/**
 * GHP Connector
 * Une bibliothèque pour interagir avec les Issues et Projects GitHub
 */

// Export library modules
export * from './lib';

// Exports commands
export * from './commands';

// Export package version
export const getVersion = (): string => {
  return '0.0.2';
};
