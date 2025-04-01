import { TokenValidator } from './token-validator';
import { TokenManager } from './token-manager';
import { Octokit } from '@octokit/rest';

// Mock Octokit
jest.mock('@octokit/rest', () => ({
  Octokit: jest.fn().mockImplementation(() => ({
    users: {
      getAuthenticated: jest.fn(),
    },
  })),
}));

describe('TokenValidator', () => {
  let validator: TokenValidator;
  let tokenManager: TokenManager;
  let mockOctokit: jest.Mocked<Octokit>;

  beforeEach(() => {
    // Reset singletons
    (TokenValidator as any).instance = null;
    (TokenManager as any).instance = null;

    validator = TokenValidator.getInstance();
    tokenManager = TokenManager.getInstance();
    mockOctokit = new Octokit() as jest.Mocked<Octokit>;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('validateToken', () => {
    it('should throw error when no token is set', async () => {
      await expect(validator.validateToken()).rejects.toThrow('No GitHub token found');
    });

    it('should validate token with all required scopes', async () => {
      const mockToken = '1234567890abcdef1234567890abcdef12345678';
      tokenManager.setToken(mockToken);

      mockOctokit.users.getAuthenticated.mockResolvedValueOnce({
        data: {
          scopes: ['issues', 'repo', 'project'],
        },
      } as any);

      const result = await validator.validateToken();
      expect(result.isValid).toBe(true);
      expect(result.missingScopes).toHaveLength(0);
    });

    it('should detect missing scopes', async () => {
      const mockToken = '1234567890abcdef1234567890abcdef12345678';
      tokenManager.setToken(mockToken);

      mockOctokit.users.getAuthenticated.mockResolvedValueOnce({
        data: {
          scopes: ['issues'],
        },
      } as any);

      const result = await validator.validateToken();
      expect(result.isValid).toBe(false);
      expect(result.missingScopes).toContain('repo');
      expect(result.missingScopes).toContain('project');
    });

    it('should handle rate limit errors', async () => {
      const mockToken = '1234567890abcdef1234567890abcdef12345678';
      tokenManager.setToken(mockToken);

      const error = new Error('Rate limit exceeded');
      (error as any).status = 429;
      mockOctokit.users.getAuthenticated.mockRejectedValueOnce(error);

      await expect(validator.validateToken()).rejects.toThrow('Rate limit exceeded');
    });

    it('should handle invalid token errors', async () => {
      const mockToken = '1234567890abcdef1234567890abcdef12345678';
      tokenManager.setToken(mockToken);

      const error = new Error('Invalid token');
      (error as any).status = 403;
      mockOctokit.users.getAuthenticated.mockRejectedValueOnce(error);

      await expect(validator.validateToken()).rejects.toThrow('GitHub token is invalid or has expired');
    });
  });

  describe('hasScope', () => {
    it('should check for specific scope presence', async () => {
      const mockToken = '1234567890abcdef1234567890abcdef12345678';
      tokenManager.setToken(mockToken);

      mockOctokit.users.getAuthenticated.mockResolvedValueOnce({
        data: {
          scopes: ['issues', 'repo'],
        },
      } as any);

      expect(await validator.hasScope('issues')).toBe(true);
      expect(await validator.hasScope('project')).toBe(false);
    });
  });

  describe('getMissingPermissionsMessage', () => {
    it('should return empty string for valid token', () => {
      const result = {
        isValid: true,
        scopes: ['issues', 'repo', 'project'],
        missingScopes: [],
      };
      expect(validator.getMissingPermissionsMessage(result)).toBe('');
    });

    it('should return detailed message for missing permissions', () => {
      const result = {
        isValid: false,
        scopes: ['issues'],
        missingScopes: ['repo', 'project'],
      };
      const message = validator.getMissingPermissionsMessage(result);
      expect(message).toContain('Missing required GitHub permissions');
      expect(message).toContain('repo');
      expect(message).toContain('project');
    });
  });

  describe('caching', () => {
    it('should cache validation results', async () => {
      const mockToken = '1234567890abcdef1234567890abcdef12345678';
      tokenManager.setToken(mockToken);

      mockOctokit.users.getAuthenticated.mockResolvedValueOnce({
        data: {
          scopes: ['issues', 'repo', 'project'],
        },
      } as any);

      // First call should hit the API
      await validator.validateToken();

      // Second call should use cache
      await validator.validateToken();

      expect(mockOctokit.users.getAuthenticated).toHaveBeenCalledTimes(1);
    });

    it('should clear cache when requested', async () => {
      const mockToken = '1234567890abcdef1234567890abcdef12345678';
      tokenManager.setToken(mockToken);

      mockOctokit.users.getAuthenticated.mockResolvedValueOnce({
        data: {
          scopes: ['issues', 'repo', 'project'],
        },
      } as any);

      await validator.validateToken();
      validator.clearCache();
      await validator.validateToken();

      expect(mockOctokit.users.getAuthenticated).toHaveBeenCalledTimes(2);
    });
  });
});
