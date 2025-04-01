/**
 * Token Manager
 * Handles GitHub token validation and security
 */

import { GitHubConfig } from '../config';

export class TokenManager {
  private static instance: TokenManager;
  private token: string | null = null;

  private constructor() {}

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
   * Set the GitHub token
   * @param token The GitHub token to set
   * @throws Error if token is invalid
   */
  public setToken(token: string): void {
    if (!this.validateToken(token)) {
      throw new Error('Invalid GitHub token format');
    }
    this.token = token;
  }

  /**
   * Get the current GitHub token
   * @returns The current GitHub token or null if not set
   */
  public getToken(): string | null {
    return this.token;
  }

  /**
   * Clear the current token
   */
  public clearToken(): void {
    this.token = null;
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
}
