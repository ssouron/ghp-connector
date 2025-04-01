import { EnterpriseConfig, EnterpriseValidationResult } from '../types/enterprise';
import { ConfigError } from '../errors/config-error';

const DEFAULT_CONFIG: EnterpriseConfig = {
  baseUrl: 'https://api.github.com',
  apiVersion: 'v3',
  verifySSL: true,
  rateLimit: {
    maxRequests: 5000,
    windowMs: 3600000, // 1 hour
  },
};

export class EnterpriseConfigManager {
  private config: EnterpriseConfig;

  constructor(config?: Partial<EnterpriseConfig>) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  /**
   * Validates the enterprise configuration
   */
  public validate(): EnterpriseValidationResult {
    const errors: string[] = [];

    if (!this.config.baseUrl) {
      errors.push('baseUrl is required');
    }

    if (!this.config.apiVersion) {
      errors.push('apiVersion is required');
    }

    if (this.config.rateLimit && this.config.rateLimit.maxRequests <= 0) {
      errors.push('rateLimit.maxRequests must be greater than 0');
    }

    if (this.config.rateLimit && this.config.rateLimit.windowMs <= 0) {
      errors.push('rateLimit.windowMs must be greater than 0');
    }

    return {
      isValid: errors.length === 0,
      errors,
      config: this.config,
    };
  }

  /**
   * Gets the current configuration
   */
  public getConfig(): EnterpriseConfig {
    return { ...this.config };
  }

  /**
   * Updates the configuration
   */
  public updateConfig(newConfig: Partial<EnterpriseConfig>): void {
    this.config = { ...this.config, ...newConfig };
    const validation = this.validate();

    if (!validation.isValid) {
      throw new ConfigError(`Invalid enterprise configuration: ${validation.errors.join(', ')}`);
    }
  }

  /**
   * Gets the API endpoint URL
   */
  public getApiUrl(path: string): string {
    const baseUrl = this.config.baseUrl.endsWith('/') ? this.config.baseUrl.slice(0, -1) : this.config.baseUrl;

    const apiPath = path.startsWith('/') ? path : `/${path}`;
    return `${baseUrl}/api/${this.config.apiVersion}${apiPath}`;
  }
}
