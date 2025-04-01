import { TokenManager } from './token-manager';
import { GitHubConfig } from '../config';

describe('TokenManager', () => {
  let tokenManager: TokenManager;

  beforeEach(() => {
    // Reset the singleton instance before each test
    (TokenManager as any).instance = null;
    tokenManager = TokenManager.getInstance();
  });

  describe('getInstance', () => {
    it('should return the same instance on multiple calls', () => {
      const instance1 = TokenManager.getInstance();
      const instance2 = TokenManager.getInstance();
      expect(instance1).toBe(instance2);
    });
  });

  describe('setToken', () => {
    it('should set a valid token', () => {
      const validToken = '0123456789abcdef0123456789abcdef01234567';
      tokenManager.setToken(validToken);
      expect(tokenManager.getToken()).toBe(validToken);
    });

    it('should throw error for invalid token format', () => {
      const invalidToken = 'invalid-token';
      expect(() => tokenManager.setToken(invalidToken)).toThrow('Invalid GitHub token format');
      expect(tokenManager.getToken()).toBeNull();
    });
  });

  describe('getToken', () => {
    it('should return null when no token is set', () => {
      expect(tokenManager.getToken()).toBeNull();
    });

    it('should return the set token', () => {
      const validToken = '0123456789abcdef0123456789abcdef01234567';
      tokenManager.setToken(validToken);
      expect(tokenManager.getToken()).toBe(validToken);
    });
  });

  describe('clearToken', () => {
    it('should clear the current token', () => {
      const validToken = '0123456789abcdef0123456789abcdef01234567';
      tokenManager.setToken(validToken);
      tokenManager.clearToken();
      expect(tokenManager.getToken()).toBeNull();
    });
  });

  describe('initializeFromConfig', () => {
    it('should set token from config', () => {
      const config: GitHubConfig = {
        owner: 'test',
        repo: 'test',
        token: '0123456789abcdef0123456789abcdef01234567',
      };
      tokenManager.initializeFromConfig(config);
      expect(tokenManager.getToken()).toBe(config.token);
    });

    it('should not set token if not present in config', () => {
      const config: GitHubConfig = {
        owner: 'test',
        repo: 'test',
      };
      tokenManager.initializeFromConfig(config);
      expect(tokenManager.getToken()).toBeNull();
    });
  });
});
