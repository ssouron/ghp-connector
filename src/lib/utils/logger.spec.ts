import { Logger } from './logger';

describe('Logger', () => {
  let logger: Logger;

  beforeEach(() => {
    logger = new Logger('TestContext');
  });

  describe('message sanitization', () => {
    it('should redact sensitive data in messages', () => {
      const consoleSpy = jest.spyOn(console, 'log');

      logger.info('Token: abc123');
      expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('[REDACTED]'));

      logger.info('Password: secret123');
      expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('[REDACTED]'));

      consoleSpy.mockRestore();
    });

    it('should not redact non-sensitive data', () => {
      const consoleSpy = jest.spyOn(console, 'log');

      logger.info('Hello world');
      expect(consoleSpy).toHaveBeenCalledWith(expect.not.stringContaining('[REDACTED]'));

      consoleSpy.mockRestore();
    });
  });

  describe('metadata sanitization', () => {
    it('should redact sensitive data in metadata', () => {
      const consoleSpy = jest.spyOn(console, 'log');

      logger.info('Test message', {
        token: 'abc123',
        password: 'secret123',
        normalData: 'hello',
      });

      const logCall = consoleSpy.mock.calls[0][0];
      expect(logCall).toContain('[REDACTED]');
      expect(logCall).toContain('normalData');
      expect(logCall).not.toContain('abc123');
      expect(logCall).not.toContain('secret123');

      consoleSpy.mockRestore();
    });

    it('should handle nested sensitive data', () => {
      const consoleSpy = jest.spyOn(console, 'log');

      logger.info('Test message', {
        credentials: {
          token: 'abc123',
          password: 'secret123',
        },
        normalData: 'hello',
      });

      const logCall = consoleSpy.mock.calls[0][0];
      expect(logCall).toContain('[REDACTED]');
      expect(logCall).toContain('normalData');
      expect(logCall).not.toContain('abc123');
      expect(logCall).not.toContain('secret123');

      consoleSpy.mockRestore();
    });
  });

  describe('log levels', () => {
    it('should format different log levels correctly', () => {
      const consoleSpy = jest.spyOn(console, 'log');

      logger.debug('Debug message');
      logger.info('Info message');
      logger.warn('Warning message');
      logger.error('Error message');

      expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('DEBUG'));
      expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('INFO'));
      expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('WARN'));
      expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('ERROR'));

      consoleSpy.mockRestore();
    });
  });

  describe('context', () => {
    it('should include context in log messages', () => {
      const consoleSpy = jest.spyOn(console, 'log');

      logger.info('Test message');
      expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('[TestContext]'));

      consoleSpy.mockRestore();
    });
  });

  describe('timestamp', () => {
    it('should include ISO timestamp in log messages', () => {
      const consoleSpy = jest.spyOn(console, 'log');

      logger.info('Test message');
      expect(consoleSpy).toHaveBeenCalledWith(expect.stringMatching(/\[\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z\]/));

      consoleSpy.mockRestore();
    });
  });

  describe('createLogger factory', () => {
    it('should create a new logger instance', () => {
      const logger = Logger.create('TestContext');
      expect(logger).toBeInstanceOf(Logger);
    });
  });
});
