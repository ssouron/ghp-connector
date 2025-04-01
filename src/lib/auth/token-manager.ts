/**
 * Token Manager
 * Handles GitHub token validation and security
 */

import { GitHubConfig } from '../config';
import { createLogger } from '../utils/logger';

interface TokenData {
  value: string;
  createdAt: Date;
  lastUsed: Date;
  rotationCount: number;
}

export class TokenManager {
  private static instance: TokenManager;
  private tokenData: TokenData | null = null;
  private lastRotationCount: number = 0;
  private readonly logger = createLogger('TokenManager');
  private readonly MAX_ROTATION_COUNT = 3;
  private readonly TOKEN_ROTATION_INTERVAL = 24 * 60 * 60 * 1000; // 24 hours

  private constructor() {
    // Ensure cleanup on process exit
    process.on('exit', () => this.secureCleanup());
    process.on('SIGINT', () => this.secureCleanup());
    process.on('SIGTERM', () => this.secureCleanup());
  }

  /**
   * Get the singleton instance of TokenManager
   */
  public static getInstance(): TokenManager {
    if (!TokenManager.instance) {
      TokenManager.instance = new TokenManager();
    }
    return TokenManager.instance;
  }

  /**
   * Set the GitHub token with secure storage
   * @param token The GitHub token to set
   * @throws Error if token is invalid
   */
  public setToken(token: string): void {
    if (!this.validateToken(token)) {
      this.logger.error('Invalid token format attempted');
      throw new Error('Invalid GitHub token format');
    }

    // Secure cleanup of existing token
    this.secureCleanup();

    // Create new token data
    this.tokenData = {
      value: token,
      createdAt: new Date(),
      lastUsed: new Date(),
      rotationCount: 0,
    };

    this.logger.info('Token set successfully');
  }

  /**
   * Get the current GitHub token with usage tracking
   * @returns The current GitHub token or null if not set
   */
  public getToken(): string | null {
    if (!this.tokenData) {
      return null;
    }

    // Update last used timestamp
    this.tokenData.lastUsed = new Date();

    // Check if token needs rotation
    const timeSinceCreation = Date.now() - this.tokenData.createdAt.getTime();
    const needsRotation = timeSinceCreation > this.TOKEN_ROTATION_INTERVAL;

    if (needsRotation) {
      if (this.tokenData.rotationCount >= this.MAX_ROTATION_COUNT) {
        this.logger.warn('Maximum rotation count reached');
        this.secureCleanup();
        return null;
      } else {
        this.logger.warn('Token rotation required');
        this.rotateToken();
      }
    }

    return this.tokenData?.value ?? null;
  }

  /**
   * Clear the current token securely
   */
  public clearToken(): void {
    this.secureCleanup();
    this.logger.info('Token cleared securely');
  }

  /**
   * Validate a GitHub token format
   * @param token The token to validate
   * @returns true if the token format is valid, false otherwise
   */
  private validateToken(token: string): boolean {
    // GitHub tokens are 40 characters long and contain only hexadecimal characters
    return /^[0-9a-fA-F]{40}$/.test(token);
  }

  /**
   * Initialize token from GitHub config
   * @param config The GitHub configuration
   */
  public initializeFromConfig(config: GitHubConfig): void {
    if (config.token) {
      this.setToken(config.token);
    }
  }

  /**
   * Rotate the current token
   */
  private rotateToken(): void {
    if (!this.tokenData) {
      return;
    }

    const newRotationCount = this.tokenData.rotationCount + 1;

    // Check if we've reached the maximum rotation count
    if (newRotationCount > this.MAX_ROTATION_COUNT) {
      this.logger.warn('Maximum rotation count reached, cleaning up token');
      this.lastRotationCount = this.MAX_ROTATION_COUNT;
      this.secureCleanup();
      return;
    }

    // Log rotation attempt
    this.logger.info(`Rotating token (rotation count: ${newRotationCount})`);

    // Create new token data with incremented rotation count
    const oldToken = this.tokenData.value;
    this.tokenData = {
      value: oldToken,
      createdAt: new Date(),
      lastUsed: new Date(),
      rotationCount: newRotationCount,
    };
    this.lastRotationCount = newRotationCount;

    // Log successful rotation
    this.logger.info('Token rotated successfully');
  }

  /**
   * Perform secure cleanup of token data
   */
  private secureCleanup(): void {
    if (this.tokenData) {
      // Overwrite token value with random data
      this.tokenData.value = Array(40).fill('0').join('');
      this.tokenData = null;
    }
  }

  /**
   * Get token usage statistics (for audit purposes)
   * @returns Object containing token usage statistics
   */
  public getTokenStats(): {
    createdAt: Date | null;
    lastUsed: Date | null;
    rotationCount: number;
    age: number;
  } {
    if (!this.tokenData) {
      return {
        createdAt: null,
        lastUsed: null,
        rotationCount: this.lastRotationCount,
        age: 0,
      };
    }

    return {
      createdAt: this.tokenData.createdAt,
      lastUsed: this.tokenData.lastUsed,
      rotationCount: this.tokenData.rotationCount,
      age: Date.now() - this.tokenData.createdAt.getTime(),
    };
  }
}
