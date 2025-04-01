import { Command } from 'commander';
import { createEnterpriseCommand } from '../enterprise';
import { EnterpriseConfigManager } from '../../lib/config/enterprise';
import { EnterpriseValidator } from '../../lib/auth/enterprise-validator';
import { EnterpriseHealthChecker } from '../../lib/health/enterprise-health';

jest.mock('../../lib/config/enterprise');
jest.mock('../../lib/auth/enterprise-validator');
jest.mock('../../lib/health/enterprise-health');

describe('Enterprise Command', () => {
  let command: Command;
  let mockConfigManager: jest.Mocked<EnterpriseConfigManager>;
  let mockValidator: jest.Mocked<EnterpriseValidator>;
  let mockHealthChecker: jest.Mocked<EnterpriseHealthChecker>;

  beforeEach(() => {
    command = createEnterpriseCommand();
    command.name('ghp-connector');
    mockConfigManager = new EnterpriseConfigManager() as jest.Mocked<EnterpriseConfigManager>;
    mockValidator = new EnterpriseValidator({} as any) as jest.Mocked<EnterpriseValidator>;
    mockHealthChecker = new EnterpriseHealthChecker({} as any) as jest.Mocked<EnterpriseHealthChecker>;

    (EnterpriseConfigManager as jest.Mock).mockImplementation(() => mockConfigManager);
    (EnterpriseValidator as jest.Mock).mockImplementation(() => mockValidator);
    (EnterpriseHealthChecker as jest.Mock).mockImplementation(() => mockHealthChecker);

    jest.spyOn(process, 'exit').mockImplementation((code?: number | string | null) => {
      throw new Error(`Process exited with code ${code}`);
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('health command', () => {
    it('should display healthy status', async () => {
      mockConfigManager.getConfig.mockReturnValue({
        baseUrl: 'https://github.example.com',
        apiVersion: 'v3',
        verifySSL: true,
      } as any);
      mockHealthChecker.checkHealth.mockResolvedValue({
        isHealthy: true,
        apiVersion: '3.0.0',
        responseTime: 100,
      });

      await command.parseAsync(['ghp-connector', 'enterprise', 'health']);
    });

    it('should display unhealthy status', async () => {
      mockConfigManager.getConfig.mockReturnValue({
        baseUrl: 'https://github.example.com',
        apiVersion: 'v3',
        verifySSL: true,
      } as any);
      mockHealthChecker.checkHealth.mockResolvedValue({
        isHealthy: false,
        apiVersion: '3.0.0',
        responseTime: 100,
        error: 'Connection failed',
      });

      await expect(command.parseAsync(['ghp-connector', 'enterprise', 'health'])).rejects.toThrow();
    });
  });

  describe('validate command', () => {
    it('should display valid configuration', async () => {
      mockConfigManager.getConfig.mockReturnValue({
        baseUrl: 'https://github.example.com',
        apiVersion: 'v3',
        verifySSL: true,
      } as any);
      mockValidator.validate.mockResolvedValue({
        isValid: true,
        errors: [],
        config: {
          baseUrl: 'https://github.example.com',
          apiVersion: 'v3',
          verifySSL: true,
        },
      });

      await command.parseAsync(['ghp-connector', 'enterprise', 'validate']);
    });

    it('should display invalid configuration', async () => {
      mockConfigManager.getConfig.mockReturnValue({
        baseUrl: 'https://github.example.com',
        apiVersion: 'v3',
        verifySSL: true,
      } as any);
      mockValidator.validate.mockResolvedValue({
        isValid: false,
        errors: ['Invalid URL'],
        config: {
          baseUrl: 'https://github.example.com',
          apiVersion: 'v3',
          verifySSL: true,
        },
      });

      await expect(command.parseAsync(['ghp-connector', 'enterprise', 'validate'])).rejects.toThrow();
    });
  });

  describe('config command', () => {
    it('should display current configuration', async () => {
      mockConfigManager.getConfig.mockReturnValue({
        baseUrl: 'https://github.example.com',
        apiVersion: 'v3',
        verifySSL: true,
      } as any);

      await command.parseAsync(['ghp-connector', 'enterprise', 'config']);
    });

    it('should update configuration', async () => {
      mockConfigManager.getConfig.mockReturnValue({
        baseUrl: 'https://github.example.com',
        apiVersion: 'v3',
        verifySSL: true,
      } as any);

      await command.parseAsync([
        'ghp-connector',
        'enterprise',
        'config',
        '--base-url',
        'https://new.example.com',
        '--api-version',
        'v4',
      ]);

      expect(mockConfigManager.updateConfig).toHaveBeenCalledWith({
        baseUrl: 'https://new.example.com',
        apiVersion: 'v4',
      });
    });

    it('should update rate limit configuration', async () => {
      mockConfigManager.getConfig.mockReturnValue({
        baseUrl: 'https://github.example.com',
        apiVersion: 'v3',
        verifySSL: true,
        rateLimit: {
          maxRequests: 5000,
          windowMs: 3600000,
        },
      } as any);

      await command.parseAsync([
        'ghp-connector',
        'enterprise',
        'config',
        '--max-requests',
        '1000',
        '--window-ms',
        '1800000',
      ]);

      expect(mockConfigManager.updateConfig).toHaveBeenCalledWith({
        rateLimit: {
          maxRequests: 1000,
          windowMs: 1800000,
        },
      });
    });

    it('should handle configuration errors', async () => {
      mockConfigManager.getConfig.mockReturnValue({
        baseUrl: 'https://github.example.com',
        apiVersion: 'v3',
        verifySSL: true,
      } as any);
      mockConfigManager.updateConfig.mockImplementation(() => {
        throw new Error('Invalid configuration');
      });

      await expect(
        command.parseAsync(['ghp-connector', 'enterprise', 'config', '--base-url', 'invalid-url'])
      ).rejects.toThrow();
    });
  });
});
