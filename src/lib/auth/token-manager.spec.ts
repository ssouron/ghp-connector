import { TokenManager } from './token-manager';
import { GitHubConfig } from '../config';

describe('TokenManager', () => {
  let tokenManager: TokenManager;
  let originalDateNow: () => number;

  beforeEach(() => {
    // Reset singleton
    (TokenManager as any).instance = null;
    tokenManager = TokenManager.getInstance();

    // Store original Date.now
    originalDateNow = Date.now;
  });

  afterEach(() => {
    tokenManager.clearToken();
    // Restore original Date.now
    Date.now = originalDateNow;
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
      const baseTime = originalDateNow();

      // Mock Date.now to return a fixed time
      Date.now = jest.fn(() => baseTime);
      tokenManager.setToken(token);

      // Mock Date.now to return a time 1 hour later
      Date.now = jest.fn(() => baseTime + 60 * 60 * 1000);

      const stats = tokenManager.getTokenStats();
      expect(stats.rotationCount).toBe(0);
      expect(stats.age).toBeCloseTo(60 * 60 * 1000, -3); // 1 hour in milliseconds, with 3 digits of precision
    });

    it('should rotate token after interval', () => {
      const token = '1234567890abcdef1234567890abcdef12345678';
      const baseTime = originalDateNow();

      // Mock Date.now to return a fixed time
      Date.now = jest.fn(() => baseTime);
      tokenManager.setToken(token);

      // Mock Date.now to simulate time passing (25 hours)
      Date.now = jest.fn(() => baseTime + 25 * 60 * 60 * 1000);

      tokenManager.getToken(); // This should trigger rotation
      const stats = tokenManager.getTokenStats();
      expect(stats.rotationCount).toBe(1);

      // Restore original Date.now
      Date.now = originalDateNow;
    });

    it('should respect maximum rotation count', () => {
      const token = '1234567890abcdef1234567890abcdef12345678';
      const baseTime = originalDateNow();

      // Mock Date.now to return a fixed time
      Date.now = jest.fn(() => baseTime);
      tokenManager.setToken(token);

      // Trigger multiple rotations by simulating time passing
      for (let i = 0; i < 4; i++) {
        // Simulate 25 hours passing for each rotation
        Date.now = jest.fn(() => baseTime + (i + 1) * 25 * 60 * 60 * 1000);
        const currentToken = tokenManager.getToken();
        const stats = tokenManager.getTokenStats();

        if (i < 3) {
          // For the first 3 rotations, we should still have a token
          expect(currentToken).toBe(token);
          expect(stats.rotationCount).toBe(i + 1);
        } else {
          // On the 4th attempt (after 3 rotations), the token should be cleared
          expect(currentToken).toBeNull();
          expect(stats.rotationCount).toBe(3);
        }
      }

      // Final verification
      const stats = tokenManager.getTokenStats();
      expect(stats.rotationCount).toBe(3); // Should not exceed MAX_ROTATION_COUNT
      expect(tokenManager.getToken()).toBeNull(); // Token should be cleared after max rotations

      // Restore original Date.now
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
      const baseTime = originalDateNow();

      // Mock Date.now to return a fixed time
      Date.now = jest.fn(() => baseTime);
      tokenManager.setToken(token);

      // Mock Date.now to return a time 1 hour later
      Date.now = jest.fn(() => baseTime + 60 * 60 * 1000);

      const stats = tokenManager.getTokenStats();
      expect(stats.createdAt).toBeDefined();
      expect(stats.lastUsed).toBeDefined();
      expect(stats.rotationCount).toBe(0);
      expect(stats.age).toBeCloseTo(60 * 60 * 1000, -3); // 1 hour in milliseconds, with 3 digits of precision
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
