import { EnterpriseConfig, EnterpriseValidationResult } from '../types/enterprise';
import axios from 'axios';
import https from 'https';

export class EnterpriseValidator {
  private config: EnterpriseConfig;

  constructor(config: EnterpriseConfig) {
    this.config = config;
  }

  /**
   * Validates the enterprise instance configuration and connectivity
   */
  public async validate(): Promise<EnterpriseValidationResult> {
    const errors: string[] = [];

    // Validate basic configuration
    if (!this.config.baseUrl) {
      errors.push('baseUrl is required');
    }

    if (!this.config.apiVersion) {
      errors.push('apiVersion is required');
    }

    if (errors.length > 0) {
      return {
        isValid: false,
        errors,
        config: this.config,
      };
    }

    try {
      // Test connectivity to the enterprise instance
      const response = await axios.get(`${this.config.baseUrl}/api/${this.config.apiVersion}/meta`, {
        validateStatus: (status: number) => status === 200,
        timeout: 5000,
        httpsAgent: this.config.verifySSL ? undefined : new https.Agent({ rejectUnauthorized: false }),
      });

      // Validate API version compatibility
      const serverVersion = response.data.installed_version;
      if (!this.isCompatibleVersion(serverVersion)) {
        errors.push(`Incompatible API version`);
      }

      // Validate rate limiting headers
      const rateLimit = response.headers['x-ratelimit-limit'];
      if (rateLimit && this.config.rateLimit && parseInt(rateLimit) < this.config.rateLimit.maxRequests) {
        errors.push('Configured rate limit exceeds server limits');
      }
    } catch (error) {
      const axiosError = error as any;
      if (axiosError.isAxiosError) {
        if (axiosError.code === 'ECONNREFUSED') {
          errors.push('Could not connect to the enterprise instance');
        } else if (axiosError.code === 'ETIMEDOUT') {
          errors.push('Connection to enterprise instance timed out');
        } else if (axiosError.response?.status === 404) {
          errors.push('Enterprise API endpoint not found');
        } else {
          errors.push(`Validation failed: ${axiosError.message}`);
        }
      } else if (error instanceof Error) {
        errors.push(`Unexpected error during validation: ${error.message}`);
      } else {
        errors.push('Unexpected error during validation: Unknown error');
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      config: this.config,
    };
  }

  /**
   * Checks if the configured API version is compatible with the server version
   */
  private isCompatibleVersion(serverVersion: string): boolean {
    // Handle v3 format
    if (this.config.apiVersion === 'v3' && serverVersion === '3.0.0') {
      return true;
    }

    // Simple version comparison for other formats
    const [major, minor] = serverVersion.split('.').map(Number);
    const configVersion = this.config.apiVersion.replace('v', '');
    const [configMajor, configMinor] = configVersion.split('.').map(Number);

    return major === configMajor && (configMinor === undefined || minor >= configMinor);
  }
}
