/**
 * Library exports
 */

// Export GitHub client
export { GitHubClient } from './github/client';

// Export configuration utilities, without validateConfig to avoid conflict with formatters/config
export {
  CONFIG_FILENAME,
  findConfigFile,
  loadConfigFile,
  getEnvConfig,
  mergeConfigs,
  cmdArgsToConfig,
  loadConfig,
  initConfigFile,
  getDefaultConfig,
} from './config';
export type { GitHubConfig, GHPConfig } from './config';

// Export error handling utilities
export * from './errors';

// Export formatters
export * from './formatters';
