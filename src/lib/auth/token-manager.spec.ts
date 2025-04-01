import { TokenManager } from './token-manager';
import { GitHubConfig } from '../config';

describe('TokenManager', () => {
  let tokenManager: TokenManager;

  beforeEach(() => {
    // Reset singleton
    (TokenManager as any).instance = null;
    tokenManager = TokenManager.getInstance();
  });

  afterEach(() => {
    tokenManager.clearToken();
  });

  describe('token management', () => {
    it('should set and get token', () => {
      const token = '1234567890abcdef1234567890abcdef12345678';
      tokenManager.setToken(token);
      expect(tokenManager.getToken()).toBe(token);
    });

    it('should clear token', () => {
      const token = '1234567890abcdef1234567890abcdef12345678';
      tokenManager.setToken(token);
      tokenManager.clearToken();
      expect(tokenManager.getToken()).toBeNull();
    });

    it('should validate token format', () => {
      const validToken = '1234567890abcdef1234567890abcdef12345678';
      const invalidToken = 'invalid-token';

      expect(() => tokenManager.setToken(validToken)).not.toThrow();
      expect(() => tokenManager.setToken(invalidToken)).toThrow('Invalid GitHub token format');
    });
  });

  describe('token rotation', () => {
    it('should track token usage', () => {
      const token = '1234567890abcdef1234567890abcdef12345678';
      tokenManager.setToken(token);

      const stats = tokenManager.getTokenStats();
      expect(stats.rotationCount).toBe(0);
      expect(stats.age).toBeGreaterThan(0);
    });

    it('should rotate token after interval', () => {
      const token = '1234567890abcdef1234567890abcdef12345678';
      tokenManager.setToken(token);

      // Mock Date.now to simulate time passing
      const originalDateNow = Date.now;
      Date.now = jest.fn(() => originalDateNow() + 25 * 60 * 60 * 1000); // 25 hours

      tokenManager.getToken(); // This should trigger rotation
      const stats = tokenManager.getTokenStats();
      expect(stats.rotationCount).toBe(1);

      Date.now = originalDateNow;
    });

    it('should respect maximum rotation count', () => {
      const token = '1234567890abcdef1234567890abcdef12345678';
      tokenManager.setToken(token);

      // Mock Date.now to simulate time passing
      const originalDateNow = Date.now;
      Date.now = jest.fn(() => originalDateNow() + 25 * 60 * 60 * 1000); // 25 hours

      // Trigger multiple rotations
      for (let i = 0; i < 4; i++) {
        tokenManager.getToken();
      }

      const stats = tokenManager.getTokenStats();
      expect(stats.rotationCount).toBe(3); // Should not exceed MAX_ROTATION_COUNT

      Date.now = originalDateNow;
    });
  });

  describe('secure cleanup', () => {
    it('should clean up token on process exit', () => {
      const token = '1234567890abcdef1234567890abcdef12345678';
      tokenManager.setToken(token);

      // Simulate process exit
      (process as any).emit('exit');
      expect(tokenManager.getToken()).toBeNull();
    });

    it('should clean up token on SIGINT', () => {
      const token = '1234567890abcdef1234567890abcdef12345678';
      tokenManager.setToken(token);

      // Simulate SIGINT
      process.emit('SIGINT');
      expect(tokenManager.getToken()).toBeNull();
    });

    it('should clean up token on SIGTERM', () => {
      const token = '1234567890abcdef1234567890abcdef12345678';
      tokenManager.setToken(token);

      // Simulate SIGTERM
      process.emit('SIGTERM');
      expect(tokenManager.getToken()).toBeNull();
    });
  });

  describe('configuration', () => {
    it('should initialize from config', () => {
      const config: GitHubConfig = {
        owner: 'test',
        repo: 'test',
        token: '1234567890abcdef1234567890abcdef12345678',
      };

      tokenManager.initializeFromConfig(config);
      expect(tokenManager.getToken()).toBe(config.token);
    });

    it('should handle config without token', () => {
      const config: GitHubConfig = {
        owner: 'test',
        repo: 'test',
      };
      tokenManager.initializeFromConfig(config);
      expect(tokenManager.getToken()).toBeNull();
    });
  });

  describe('token stats', () => {
    it('should provide accurate token statistics', () => {
      const token = '1234567890abcdef1234567890abcdef12345678';
      tokenManager.setToken(token);

      const stats = tokenManager.getTokenStats();
      expect(stats.createdAt).toBeDefined();
      expect(stats.lastUsed).toBeDefined();
      expect(stats.rotationCount).toBe(0);
      expect(stats.age).toBeGreaterThan(0);
    });

    it('should return null stats when no token is set', () => {
      const stats = tokenManager.getTokenStats();
      expect(stats.createdAt).toBeNull();
      expect(stats.lastUsed).toBeNull();
      expect(stats.rotationCount).toBe(0);
      expect(stats.age).toBe(0);
    });
  });
});
