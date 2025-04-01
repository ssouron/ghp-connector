import { EnterpriseHealthChecker } from '../enterprise-health';
import { EnterpriseConfig } from '../../types/enterprise';
import axios, { AxiosError } from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('EnterpriseHealthChecker', () => {
  const mockConfig: EnterpriseConfig = {
    baseUrl: 'https://github.example.com',
    apiVersion: 'v3',
    verifySSL: true,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(Date, 'now').mockImplementation(() => 1000);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should report healthy status on successful connection', async () => {
    mockedAxios.get.mockResolvedValueOnce({
      data: { installed_version: '3.0.0' },
    });

    const checker = new EnterpriseHealthChecker(mockConfig);
    const result = await checker.checkHealth();

    expect(result.isHealthy).toBe(true);
    expect(result.apiVersion).toBe('3.0.0');
    expect(result.responseTime).toBeGreaterThanOrEqual(0);
    expect(result.error).toBeUndefined();
  });

  it('should report unhealthy status on connection refused', async () => {
    const error = {
      isAxiosError: true,
      code: 'ECONNREFUSED',
      message: 'Could not connect to the enterprise instance',
    } as AxiosError;
    mockedAxios.get.mockRejectedValueOnce(error);

    const checker = new EnterpriseHealthChecker(mockConfig);
    const result = await checker.checkHealth();

    expect(result.isHealthy).toBe(false);
    expect(result.apiVersion).toBe(mockConfig.apiVersion);
    expect(result.responseTime).toBeGreaterThanOrEqual(0);
    expect(result.error).toBe('Could not connect to the enterprise instance');
  });

  it('should report unhealthy status on timeout', async () => {
    const error = {
      isAxiosError: true,
      code: 'ETIMEDOUT',
      message: 'Connection to enterprise instance timed out',
    } as AxiosError;
    mockedAxios.get.mockRejectedValueOnce(error);

    const checker = new EnterpriseHealthChecker(mockConfig);
    const result = await checker.checkHealth();

    expect(result.isHealthy).toBe(false);
    expect(result.apiVersion).toBe(mockConfig.apiVersion);
    expect(result.responseTime).toBeGreaterThanOrEqual(0);
    expect(result.error).toBe('Connection to enterprise instance timed out');
  });

  it('should report unhealthy status on 404 error', async () => {
    const error = {
      isAxiosError: true,
      response: { status: 404 },
      message: 'Enterprise API endpoint not found',
    } as AxiosError;
    mockedAxios.get.mockRejectedValueOnce(error);

    const checker = new EnterpriseHealthChecker(mockConfig);
    const result = await checker.checkHealth();

    expect(result.isHealthy).toBe(false);
    expect(result.apiVersion).toBe(mockConfig.apiVersion);
    expect(result.responseTime).toBeGreaterThanOrEqual(0);
    expect(result.error).toBe('Enterprise API endpoint not found');
  });

  it('should report unhealthy status on authentication error', async () => {
    const error = {
      isAxiosError: true,
      response: { status: 401 },
      message: 'Authentication failed with enterprise instance',
    } as AxiosError;
    mockedAxios.get.mockRejectedValueOnce(error);

    const checker = new EnterpriseHealthChecker(mockConfig);
    const result = await checker.checkHealth();

    expect(result.isHealthy).toBe(false);
    expect(result.apiVersion).toBe(mockConfig.apiVersion);
    expect(result.responseTime).toBeGreaterThanOrEqual(0);
    expect(result.error).toBe('Authentication failed with enterprise instance');
  });

  it('should report unhealthy status on access denied error', async () => {
    const error = {
      isAxiosError: true,
      response: { status: 403 },
      message: 'Access denied to enterprise instance',
    } as AxiosError;
    mockedAxios.get.mockRejectedValueOnce(error);

    const checker = new EnterpriseHealthChecker(mockConfig);
    const result = await checker.checkHealth();

    expect(result.isHealthy).toBe(false);
    expect(result.apiVersion).toBe(mockConfig.apiVersion);
    expect(result.responseTime).toBeGreaterThanOrEqual(0);
    expect(result.error).toBe('Access denied to enterprise instance');
  });

  it('should handle unknown errors gracefully', async () => {
    mockedAxios.get.mockRejectedValueOnce(new Error('Unknown error'));

    const checker = new EnterpriseHealthChecker(mockConfig);
    const result = await checker.checkHealth();

    expect(result.isHealthy).toBe(false);
    expect(result.apiVersion).toBe(mockConfig.apiVersion);
    expect(result.responseTime).toBeGreaterThanOrEqual(0);
    expect(result.error).toBe('Unknown error');
  });
});
