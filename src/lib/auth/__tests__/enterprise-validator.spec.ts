import { EnterpriseValidator } from '../enterprise-validator';
import { EnterpriseConfig } from '../../types/enterprise';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('EnterpriseValidator', () => {
  const mockConfig: EnterpriseConfig = {
    baseUrl: 'https://github.example.com',
    apiVersion: 'v3',
    verifySSL: true,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should validate basic configuration', async () => {
    mockedAxios.get.mockResolvedValueOnce({
      data: { installed_version: '3.0.0' },
      headers: { 'x-ratelimit-limit': '5000' },
    });

    const validator = new EnterpriseValidator(mockConfig);
    const result = await validator.validate();

    expect(result.isValid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('should detect missing baseUrl', async () => {
    const invalidConfig = { ...mockConfig, baseUrl: '' };
    const validator = new EnterpriseValidator(invalidConfig);
    const result = await validator.validate();

    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('baseUrl is required');
  });

  it('should detect missing apiVersion', async () => {
    const invalidConfig = { ...mockConfig, apiVersion: '' };
    const validator = new EnterpriseValidator(invalidConfig);
    const result = await validator.validate();

    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('apiVersion is required');
  });

  it('should validate successful connection', async () => {
    mockedAxios.get.mockResolvedValueOnce({
      data: { installed_version: '3.0.0' },
      headers: { 'x-ratelimit-limit': '5000' },
    });

    const validator = new EnterpriseValidator(mockConfig);
    const result = await validator.validate();

    expect(result.isValid).toBe(true);
    expect(result.errors).toHaveLength(0);
    expect(mockedAxios.get).toHaveBeenCalledWith(
      `${mockConfig.baseUrl}/api/${mockConfig.apiVersion}/meta`,
      expect.any(Object)
    );
  });

  it('should detect incompatible API version', async () => {
    mockedAxios.get.mockResolvedValueOnce({
      data: { installed_version: '2.0.0' },
      headers: { 'x-ratelimit-limit': '5000' },
    });

    const validator = new EnterpriseValidator(mockConfig);
    const result = await validator.validate();

    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Incompatible API version');
  });

  it('should detect rate limit issues', async () => {
    mockedAxios.get.mockResolvedValueOnce({
      data: { installed_version: '3.0.0' },
      headers: { 'x-ratelimit-limit': '1000' },
    });

    const configWithRateLimit = {
      ...mockConfig,
      rateLimit: { maxRequests: 2000, windowMs: 3600000 },
    };

    const validator = new EnterpriseValidator(configWithRateLimit);
    const result = await validator.validate();

    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Configured rate limit exceeds server limits');
  });

  it('should handle connection errors', async () => {
    const error = {
      isAxiosError: true,
      code: 'ECONNREFUSED',
      message: 'Could not connect to the enterprise instance',
    } as any;
    mockedAxios.get.mockRejectedValueOnce(error);

    const validator = new EnterpriseValidator(mockConfig);
    const result = await validator.validate();

    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Could not connect to the enterprise instance');
  });

  it('should handle timeout errors', async () => {
    const error = {
      isAxiosError: true,
      code: 'ETIMEDOUT',
      message: 'Connection to enterprise instance timed out',
    } as any;
    mockedAxios.get.mockRejectedValueOnce(error);

    const validator = new EnterpriseValidator(mockConfig);
    const result = await validator.validate();

    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Connection to enterprise instance timed out');
  });

  it('should handle 404 errors', async () => {
    const error = {
      isAxiosError: true,
      response: { status: 404 },
      message: 'Enterprise API endpoint not found',
    } as any;
    mockedAxios.get.mockRejectedValueOnce(error);

    const validator = new EnterpriseValidator(mockConfig);
    const result = await validator.validate();

    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Enterprise API endpoint not found');
  });
});
