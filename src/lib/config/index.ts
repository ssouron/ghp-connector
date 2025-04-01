/**
 * Configuration Manager
 * Handles loading and merging configuration from different sources
 */

import fs from 'fs';
import path from 'path';
import os from 'os';

// Define configuration file name
export const CONFIG_FILENAME = '.ghprc.json';

// Default configuration
const defaultConfig = {
  github: {
    owner: '',
    repo: '',
    baseUrl: 'https://api.github.com',
  },
  defaults: {
    format: 'human',
    issues: {
      state: 'open',
      limit: 10,
      sort: 'created',
      direction: 'desc',
    },
    projects: {},
  },
};

// Define GitHub config interface
export interface GitHubConfig {
  owner: string;
  repo: string;
  token?: string;
  baseUrl?: string;
}

// Define configuration interface
export interface GHPConfig {
  github: GitHubConfig;
  defaults: {
    format: 'human' | 'json' | 'table' | 'minimal';
    issues: {
      state: string;
      limit?: number;
      sort?: string;
      direction?: string;
      [key: string]: any;
    };
    projects: {
      [key: string]: any;
    };
  };
}

/**
 * Find and load the configuration file
 * Searches in the following locations (in order):
 * 1. Current directory (./.ghprc.json)
 * 2. User's home directory (~/.ghprc.json)
 */
export function findConfigFile(): string | null {
  // Check current directory
  const currentDirConfig = path.join(process.cwd(), CONFIG_FILENAME);
  if (fs.existsSync(currentDirConfig)) {
    return currentDirConfig;
  }

  // Check home directory
  const homeDirConfig = path.join(os.homedir(), CONFIG_FILENAME);
  if (fs.existsSync(homeDirConfig)) {
    return homeDirConfig;
  }

  return null;
}

/**
 * Load the configuration file
 */
export function loadConfigFile(filePath: string): Partial<GHPConfig> {
  try {
    const configContent = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(configContent) as Partial<GHPConfig>;
  } catch (error) {
    throw new Error(`Failed to load config file: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * Get environment variable configuration
 */
export function getEnvConfig(): Partial<GHPConfig> {
  const github: Partial<GitHubConfig> = {};

  // Only set properties that are actually defined in environment variables
  if (process.env.GITHUB_OWNER) {
    github.owner = process.env.GITHUB_OWNER;
  }

  if (process.env.GITHUB_REPO) {
    github.repo = process.env.GITHUB_REPO;
  }

  if (process.env.GITHUB_TOKEN) {
    github.token = process.env.GITHUB_TOKEN;
  }

  if (process.env.GITHUB_API_URL) {
    github.baseUrl = process.env.GITHUB_API_URL;
  }

  // Only include github config if at least one property is set
  const envConfig: Partial<GHPConfig> = {};
  if (Object.keys(github).length > 0) {
    envConfig.github = github as GitHubConfig;
  }

  return envConfig;
}

/**
 * Merge configurations from different sources
 * Priority (highest to lowest):
 * 1. Command line arguments
 * 2. Environment variables
 * 3. Config file
 * 4. Default values
 */
export function mergeConfigs(
  cmdConfig: Partial<GHPConfig>,
  envConfig: Partial<GHPConfig>,
  fileConfig: Partial<GHPConfig>
): GHPConfig {
  // Start with default config
  const result = JSON.parse(JSON.stringify(defaultConfig)) as GHPConfig;

  // Merge in order of priority (lowest to highest)
  return deepMerge(deepMerge(deepMerge(result, fileConfig), envConfig), cmdConfig);
}

/**
 * Deep merge two objects
 */
function deepMerge<T>(target: T, source: Partial<T>): T {
  if (!source) return target;

  const output = { ...target };

  Object.keys(source).forEach((key) => {
    const targetValue = (output as any)[key];
    const sourceValue = (source as any)[key];

    if (typeof sourceValue === 'object' && sourceValue !== null && !Array.isArray(sourceValue)) {
      if (typeof targetValue === 'object' && targetValue !== null && !Array.isArray(targetValue)) {
        (output as any)[key] = deepMerge(targetValue, sourceValue);
      } else {
        (output as any)[key] = { ...sourceValue };
      }
    } else if (sourceValue !== undefined) {
      (output as any)[key] = sourceValue;
    }
  });

  return output;
}

/**
 * Convert command-line options to config structure
 */
export function cmdArgsToConfig(options: any): Partial<GHPConfig> {
  const config: Partial<GHPConfig> = {};

  if (options.owner || options.repo) {
    config.github = {} as GitHubConfig;

    if (options.owner) {
      config.github.owner = options.owner;
    }

    if (options.repo) {
      config.github.repo = options.repo;
    }
  }

  if (options.format) {
    if (!config.defaults) {
      config.defaults = {} as GHPConfig['defaults'];
    }
    config.defaults.format = options.format;
  }

  return config;
}

/**
 * Load configuration from all sources and merge them
 */
export function loadConfig(cmdArgs: Partial<GHPConfig> = {}): GHPConfig {
  // Load config from environment
  const envConfig = getEnvConfig();

  // Load config from file
  let fileConfig: Partial<GHPConfig> = {};
  const configPath = findConfigFile();
  if (configPath) {
    try {
      fileConfig = loadConfigFile(configPath);
    } catch (error) {
      console.error(`Warning: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  // Merge all configs
  return mergeConfigs(cmdArgs, envConfig, fileConfig);
}

/**
 * Create a new config file with default settings
 */
export function initConfigFile(filePath: string): void {
  try {
    const configStr = JSON.stringify(defaultConfig, null, 2);
    fs.writeFileSync(filePath, configStr, 'utf-8');
  } catch (error) {
    throw new Error(`Failed to create config file: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * Get default configuration as a template
 */
export function getDefaultConfig(): GHPConfig {
  return JSON.parse(JSON.stringify(defaultConfig)) as GHPConfig;
}

/**
 * Validate configuration
 * Returns true if valid, throws error if invalid
 */
export function validateConfig(config: Partial<GHPConfig>): boolean {
  // We'll add more validation in the future as needed
  if (config.github) {
    if (config.github.baseUrl) {
      try {
        new URL(config.github.baseUrl);
      } catch (error) {
        throw new Error(`Invalid baseUrl: ${config.github.baseUrl}`);
      }
    }
  }

  return true;
}
