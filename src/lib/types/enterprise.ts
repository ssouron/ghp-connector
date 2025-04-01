export interface EnterpriseConfig {
  /** The base URL of the GitHub Enterprise instance */
  baseUrl: string;
  /** The API version to use (e.g., 'v3') */
  apiVersion: string;
  /** Whether to verify SSL/TLS certificates */
  verifySSL: boolean;
  /** Custom headers to include in all requests */
  headers?: Record<string, string>;
  /** Rate limiting configuration */
  rateLimit?: {
    /** Maximum number of requests per hour */
    maxRequests: number;
    /** Time window for rate limiting in milliseconds */
    windowMs: number;
  };
}

export interface EnterpriseHealthStatus {
  /** Whether the instance is healthy */
  isHealthy: boolean;
  /** Current API version */
  apiVersion: string;
  /** Server response time in milliseconds */
  responseTime: number;
  /** Any error messages if unhealthy */
  error?: string;
}

export interface EnterpriseValidationResult {
  /** Whether the configuration is valid */
  isValid: boolean;
  /** Any validation errors */
  errors: string[];
  /** The validated configuration */
  config: EnterpriseConfig;
}
