/**
 * Unit tests for error handling module
 */

import {
  ExitCode,
  GHPError,
  ValidationError,
  NetworkError,
  AuthenticationError,
  NotFoundError,
  GitHubAPIError,
  ConfigurationError,
  handleError,
  wrapWithErrorHandler,
} from './index';

describe('Error Types', () => {
  describe('GHPError', () => {
    it('should create a base error with default exit code', () => {
      const error = new GHPError('Base error message');
      expect(error).toBeInstanceOf(Error);
      expect(error).toBeInstanceOf(GHPError);
      expect(error.message).toBe('Base error message');
      expect(error.name).toBe('GHPError');
      expect(error.exitCode).toBe(ExitCode.GeneralError);
    });

    it('should create a base error with custom exit code', () => {
      const error = new GHPError('Base error message', ExitCode.NotFoundError);
      expect(error.exitCode).toBe(ExitCode.NotFoundError);
    });
  });

  describe('ValidationError', () => {
    it('should create a validation error with correct exit code', () => {
      const error = new ValidationError('Invalid input');
      expect(error).toBeInstanceOf(GHPError);
      expect(error).toBeInstanceOf(ValidationError);
      expect(error.message).toBe('Invalid input');
      expect(error.name).toBe('ValidationError');
      expect(error.exitCode).toBe(ExitCode.ValidationError);
    });
  });

  describe('NetworkError', () => {
    it('should create a network error with correct exit code', () => {
      const error = new NetworkError('Connection failed');
      expect(error).toBeInstanceOf(GHPError);
      expect(error).toBeInstanceOf(NetworkError);
      expect(error.message).toBe('Connection failed');
      expect(error.name).toBe('NetworkError');
      expect(error.exitCode).toBe(ExitCode.NetworkError);
    });
  });

  describe('AuthenticationError', () => {
    it('should create an authentication error with correct exit code', () => {
      const error = new AuthenticationError('Invalid token');
      expect(error).toBeInstanceOf(GHPError);
      expect(error).toBeInstanceOf(AuthenticationError);
      expect(error.message).toBe('Invalid token');
      expect(error.name).toBe('AuthenticationError');
      expect(error.exitCode).toBe(ExitCode.AuthenticationError);
    });
  });

  describe('NotFoundError', () => {
    it('should create a not found error with correct exit code', () => {
      const error = new NotFoundError('Resource not found');
      expect(error).toBeInstanceOf(GHPError);
      expect(error).toBeInstanceOf(NotFoundError);
      expect(error.message).toBe('Resource not found');
      expect(error.name).toBe('NotFoundError');
      expect(error.exitCode).toBe(ExitCode.NotFoundError);
    });
  });

  describe('GitHubAPIError', () => {
    it('should create a GitHub API error with correct exit code', () => {
      const error = new GitHubAPIError('API rate limit exceeded');
      expect(error).toBeInstanceOf(GHPError);
      expect(error).toBeInstanceOf(GitHubAPIError);
      expect(error.message).toBe('API rate limit exceeded');
      expect(error.name).toBe('GitHubAPIError');
      expect(error.exitCode).toBe(ExitCode.GitHubAPIError);
      expect(error.response).toBeUndefined();
    });

    it('should create a GitHub API error with response data', () => {
      const responseData = { status: 403, message: 'Rate limit exceeded' };
      const error = new GitHubAPIError('API rate limit exceeded', responseData);
      expect(error.response).toBe(responseData);
    });
  });

  describe('ConfigurationError', () => {
    it('should create a configuration error with correct exit code', () => {
      const error = new ConfigurationError('Invalid configuration');
      expect(error).toBeInstanceOf(GHPError);
      expect(error).toBeInstanceOf(ConfigurationError);
      expect(error.message).toBe('Invalid configuration');
      expect(error.name).toBe('ConfigurationError');
      expect(error.exitCode).toBe(ExitCode.ConfigurationError);
    });
  });
});

describe('Error Handling Functions', () => {
  describe('handleError', () => {
    let consoleErrorSpy: jest.SpyInstance;
    let processExitSpy: jest.SpyInstance;

    beforeEach(() => {
      consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
      processExitSpy = jest.spyOn(process, 'exit').mockImplementation((() => {}) as any);
    });

    afterEach(() => {
      consoleErrorSpy.mockRestore();
      processExitSpy.mockRestore();
    });

    it('should handle GHPError correctly', () => {
      const error = new ValidationError('Invalid input');
      handleError(error);

      expect(consoleErrorSpy).toHaveBeenCalledWith('Error: Invalid input');
      expect(processExitSpy).toHaveBeenCalledWith(ExitCode.ValidationError);
    });

    it('should handle GitHubAPIError with response data in verbose mode', () => {
      const responseData = { status: 403, message: 'Rate limit exceeded' };
      const error = new GitHubAPIError('API error', responseData);
      handleError(error, true);

      expect(consoleErrorSpy).toHaveBeenCalledWith(expect.stringContaining('GitHub API Error: API error'));
      expect(consoleErrorSpy).toHaveBeenCalledWith(expect.stringContaining(JSON.stringify(responseData, null, 2)));
      expect(processExitSpy).toHaveBeenCalledWith(ExitCode.GitHubAPIError);
    });

    it('should handle GitHubAPIError without response data details in non-verbose mode', () => {
      const responseData = { status: 403, message: 'Rate limit exceeded' };
      const error = new GitHubAPIError('API error', responseData);
      handleError(error, false);

      expect(consoleErrorSpy).toHaveBeenCalledWith(expect.stringContaining('GitHub API Error: API error'));
      expect(consoleErrorSpy).not.toHaveBeenCalledWith(expect.stringContaining(JSON.stringify(responseData, null, 2)));
      expect(processExitSpy).toHaveBeenCalledWith(ExitCode.GitHubAPIError);
    });

    it('should handle non-GHPError with message', () => {
      const error = new Error('Standard error');
      handleError(error);

      expect(consoleErrorSpy).toHaveBeenCalledWith('Error: Standard error');
      expect(processExitSpy).toHaveBeenCalledWith(ExitCode.GeneralError);
    });

    it('should handle non-Error objects', () => {
      handleError('String error');

      expect(consoleErrorSpy).toHaveBeenCalledWith('Error: String error');
      expect(processExitSpy).toHaveBeenCalledWith(ExitCode.GeneralError);
    });

    it('should print stack trace in verbose mode', () => {
      const error = new Error('With stack');
      error.stack = 'Error: With stack\n    at file.js:1:1';
      handleError(error, true);

      expect(consoleErrorSpy).toHaveBeenCalledWith('\nStack trace:');
      expect(consoleErrorSpy).toHaveBeenCalledWith(error.stack);
    });
  });

  describe('wrapWithErrorHandler', () => {
    it('should return function result on success', async () => {
      // Créer une fonction qui retourne toujours une valeur de succès
      const successFn = async () => 'success';
      const wrapped = wrapWithErrorHandler(successFn);

      const result = await wrapped();
      expect(result).toBe('success');
    });

    it('should pass arguments correctly to the wrapped function', async () => {
      const argTestFn = async (a: string, b: number) => `${a}-${b}`;
      const wrapped = wrapWithErrorHandler(argTestFn);

      const result = await wrapped('test', 123);
      expect(result).toBe('test-123');
    });

    it('should handle errors with default verbose setting', async () => {
      // Espionner sans empêcher le comportement normal
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

      // Remplacer process.exit pour éviter qu'il ne termine le processus de test
      const originalExit = process.exit;
      process.exit = jest.fn() as any;

      const errorFn = async () => {
        throw new ValidationError('Test validation error');
      };

      const wrapped = wrapWithErrorHandler(errorFn);

      // Exécuter la fonction mais ignorer l'erreur
      await wrapped().catch(() => {});

      expect(consoleErrorSpy).toHaveBeenCalledWith('Error: Test validation error');
      expect(process.exit).toHaveBeenCalledWith(ExitCode.ValidationError);

      // Restaurer les fonctions originales
      consoleErrorSpy.mockRestore();
      process.exit = originalExit;
    });

    it('should handle errors with verbose=true', async () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

      // Remplacer process.exit
      const originalExit = process.exit;
      process.exit = jest.fn() as any;

      const errorWithStackFn = async () => {
        const error = new Error('Error with stack');
        error.stack = 'Error: Error with stack\n    at file.js:1:1';
        throw error;
      };

      const wrapped = wrapWithErrorHandler(errorWithStackFn, true);

      // Exécuter la fonction mais ignorer l'erreur
      await wrapped().catch(() => {});

      expect(consoleErrorSpy).toHaveBeenCalledWith('\nStack trace:');
      expect(process.exit).toHaveBeenCalledWith(ExitCode.GeneralError);

      // Restaurer les fonctions originales
      consoleErrorSpy.mockRestore();
      process.exit = originalExit;
    });
  });
});

describe('Exit Codes', () => {
  it('should have correct exit code values', () => {
    expect(ExitCode.Success).toBe(0);
    expect(ExitCode.GeneralError).toBe(1);
    expect(ExitCode.ValidationError).toBe(2);
    expect(ExitCode.NetworkError).toBe(3);
    expect(ExitCode.AuthenticationError).toBe(4);
    expect(ExitCode.NotFoundError).toBe(5);
    expect(ExitCode.GitHubAPIError).toBe(6);
    expect(ExitCode.ConfigurationError).toBe(7);
  });
});
