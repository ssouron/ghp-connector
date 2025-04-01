/**
 * Configuration File Manager
 * Handles secure reading and validation of configuration files
 */

import fs from 'fs';
import path from 'path';
import os from 'os';
import { TokenManager } from './token-manager';
import { GitHubConfig } from '../config';

export class ConfigFileManager {
  private static instance: ConfigFileManager;
  private readonly CONFIG_FILENAME = '.ghprc.json';
  private tokenManager: TokenManager;

  private constructor() {
    this.tokenManager = TokenManager.getInstance();
  }

  /**
   * Get the singleton instance of ConfigFileManager
   */
  public static getInstance(): ConfigFileManager {
    if (!ConfigFileManager.instance) {
      ConfigFileManager.instance = new ConfigFileManager();
    }
    return ConfigFileManager.instance;
  }

  /**
   * Find and validate configuration file
   * @returns The path to the config file or null if not found
   * @throws Error if file permissions are unsafe
   */
  public findConfigFile(): string | null {
    // Check current directory
    const currentDirConfig = path.join(process.cwd(), this.CONFIG_FILENAME);
    if (this.isValidConfigFile(currentDirConfig)) {
      return currentDirConfig;
    }

    // Check home directory
    const homeDirConfig = path.join(os.homedir(), this.CONFIG_FILENAME);
    if (this.isValidConfigFile(homeDirConfig)) {
      return homeDirConfig;
    }

    return null;
  }

  /**
   * Load and validate configuration from file
   * @param filePath Path to the configuration file
   * @returns The loaded configuration
   * @throws Error if file is invalid or unsafe
   */
  public loadConfigFile(filePath: string): Partial<GitHubConfig> {
    try {
      const configContent = fs.readFileSync(filePath, 'utf-8');
      const config = JSON.parse(configContent) as Partial<GitHubConfig>;

      // Validate and process token if present
      if (config.token) {
        this.tokenManager.setToken(config.token);
      }

      return config;
    } catch (error) {
      throw new Error(`Failed to load config file: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Validate configuration file permissions and content
   * @param filePath Path to the configuration file
   * @returns true if the file is valid and secure
   * @throws Error if file permissions are unsafe
   */
  private isValidConfigFile(filePath: string): boolean {
    if (!fs.existsSync(filePath)) {
      return false;
    }

    // Check file permissions
    const stats = fs.statSync(filePath);
    const mode = stats.mode;
    const isReadableByOthers = (mode & 0o004) !== 0;
    const isWritableByOthers = (mode & 0o002) !== 0;

    if (isReadableByOthers || isWritableByOthers) {
      throw new Error(
        `Configuration file ${filePath} has unsafe permissions. Please set permissions to 600 (user read/write only).`
      );
    }

    return true;
  }

  /**
   * Create a new configuration file with secure permissions
   * @param filePath Path where to create the configuration file
   * @param config Initial configuration content
   * @throws Error if file creation fails
   */
  public createConfigFile(filePath: string, config: Partial<GitHubConfig>): void {
    try {
      fs.writeFileSync(filePath, JSON.stringify(config, null, 2));
      // Set secure permissions (600 - user read/write only)
      fs.chmodSync(filePath, 0o600);
    } catch (error) {
      throw new Error(`Failed to create config file: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
}
