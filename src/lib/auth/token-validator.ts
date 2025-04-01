/**
 * Token Validator
 * Handles GitHub token permission validation and scope checking
 */

import { Octokit } from '@octokit/rest';
import { TokenManager } from './token-manager';

interface TokenValidationResult {
  isValid: boolean;
  scopes: string[];
  missingScopes: string[];
  rateLimit?: {
    remaining: number;
    reset: Date;
  };
}

export class TokenValidator {
  private static instance: TokenValidator;
  private cache: Map<string, { result: TokenValidationResult; timestamp: number }>;
  private cacheDuration: number = 5 * 60 * 1000; // 5 minutes
  private requiredScopes: string[] = ['issues', 'repo', 'project'];

  private constructor() {
    this.cache = new Map();
  }

  /**
   * Get the singleton instance of TokenValidator
   */
  public static getInstance(): TokenValidator {
    if (!TokenValidator.instance) {
      TokenValidator.instance = new TokenValidator();
    }
    return TokenValidator.instance;
  }

  /**
   * Validate the current token's permissions
   * @returns Promise containing the validation result
   * @throws Error if token is not set or validation fails
   */
  public async validateToken(): Promise<TokenValidationResult> {
    const token = TokenManager.getInstance().getToken();
    if (!token) {
      throw new Error('No GitHub token found. Please set a token first.');
    }

    // Check cache first
    const cached = this.cache.get(token);
    if (cached && Date.now() - cached.timestamp < this.cacheDuration) {
      return cached.result;
    }

    try {
      const octokit = new Octokit({ auth: token });
      const { data: user } = await octokit.users.getAuthenticated();
      const scopes = user.scopes || [];

      const result: TokenValidationResult = {
        isValid: this.requiredScopes.every((scope) => scopes.includes(scope)),
        scopes,
        missingScopes: this.requiredScopes.filter((scope) => !scopes.includes(scope)),
      };

      // Cache the result
      this.cache.set(token, {
        result,
        timestamp: Date.now(),
      });

      return result;
    } catch (error) {
      if (error.status === 403) {
        throw new Error('GitHub token is invalid or has expired.');
      }
      if (error.status === 429) {
        throw new Error('Rate limit exceeded. Please try again later.');
      }
      throw new Error(`Failed to validate token: ${error.message}`);
    }
  }

  /**
   * Check if the token has a specific scope
   * @param scope The scope to check
   * @returns Promise containing whether the scope is present
   */
  public async hasScope(scope: string): Promise<boolean> {
    const result = await this.validateToken();
    return result.scopes.includes(scope);
  }

  /**
   * Get detailed error message for missing permissions
   * @param result The validation result
   * @returns A formatted error message
   */
  public getMissingPermissionsMessage(result: TokenValidationResult): string {
    if (result.isValid) {
      return '';
    }

    return (
      `Missing required GitHub permissions: ${result.missingScopes.join(', ')}. ` +
      `Please ensure your token has the following scopes: ${this.requiredScopes.join(', ')}.`
    );
  }

  /**
   * Clear the validation cache
   */
  public clearCache(): void {
    this.cache.clear();
  }
}
