import { EnterpriseConfig, EnterpriseHealthStatus } from '../types/enterprise';
import axios, { AxiosError } from 'axios';
import https from 'https';

export class EnterpriseHealthChecker {
  private config: EnterpriseConfig;

  constructor(config: EnterpriseConfig) {
    this.config = config;
  }

  /**
   * Checks the health of the enterprise instance
   */
  public async checkHealth(): Promise<EnterpriseHealthStatus> {
    const startTime = Date.now();

    try {
      const response = await axios.get(`${this.config.baseUrl}/api/${this.config.apiVersion}/meta`, {
        validateStatus: (status: number) => status === 200,
        timeout: 5000,
        httpsAgent: this.config.verifySSL ? undefined : new https.Agent({ rejectUnauthorized: false }),
      });

      const responseTime = Date.now() - startTime;

      return {
        isHealthy: true,
        apiVersion: response.data.installed_version,
        responseTime,
      };
    } catch (error: unknown) {
      const responseTime = Date.now() - startTime;
      const axiosError = error as any;

      if (axiosError.isAxiosError) {
        return {
          isHealthy: false,
          apiVersion: this.config.apiVersion,
          responseTime,
          error: this.getErrorMessage(axiosError),
        };
      }

      return {
        isHealthy: false,
        apiVersion: this.config.apiVersion,
        responseTime,
        error: error instanceof Error ? error.message : 'Unknown error occurred during health check',
      };
    }
  }

  /**
   * Gets a user-friendly error message from an Axios error
   */
  private getErrorMessage(error: AxiosError): string {
    if (error.code === 'ECONNREFUSED') {
      return 'Could not connect to the enterprise instance';
    }
    if (error.code === 'ETIMEDOUT') {
      return 'Connection to enterprise instance timed out';
    }
    if (error.response?.status === 404) {
      return 'Enterprise API endpoint not found';
    }
    if (error.response?.status === 401) {
      return 'Authentication failed with enterprise instance';
    }
    if (error.response?.status === 403) {
      return 'Access denied to enterprise instance';
    }
    return 'Unknown error occurred during health check';
  }
}
