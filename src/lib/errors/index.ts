/**
 * Error handling utilities
 * Provides custom error classes and error handling functions
 */

/**
 * Standard error exit codes
 */
export enum ExitCode {
  Success = 0,
  GeneralError = 1,
  ValidationError = 2,
  NetworkError = 3,
  AuthenticationError = 4,
  NotFoundError = 5,
  GitHubAPIError = 6,
  ConfigurationError = 7,
}

/**
 * Base error class for GHP Connector
 */
export class GHPError extends Error {
  exitCode: ExitCode;
  
  constructor(message: string, exitCode: ExitCode = ExitCode.GeneralError) {
    super(message);
    this.name = this.constructor.name;
    this.exitCode = exitCode;
  }
}

/**
 * Error thrown when input validation fails
 */
export class ValidationError extends GHPError {
  constructor(message: string) {
    super(message, ExitCode.ValidationError);
  }
}

/**
 * Error thrown when a network error occurs
 */
export class NetworkError extends GHPError {
  constructor(message: string) {
    super(message, ExitCode.NetworkError);
  }
}

/**
 * Error thrown when authentication fails
 */
export class AuthenticationError extends GHPError {
  constructor(message: string) {
    super(message, ExitCode.AuthenticationError);
  }
}

/**
 * Error thrown when a resource is not found
 */
export class NotFoundError extends GHPError {
  constructor(message: string) {
    super(message, ExitCode.NotFoundError);
  }
}

/**
 * Error thrown when a GitHub API error occurs
 */
export class GitHubAPIError extends GHPError {
  response?: any;
  
  constructor(message: string, response?: any) {
    super(message, ExitCode.GitHubAPIError);
    this.response = response;
  }
}

/**
 * Error thrown when there's a configuration error
 */
export class ConfigurationError extends GHPError {
  constructor(message: string) {
    super(message, ExitCode.ConfigurationError);
  }
}

/**
 * Handle errors and provide user-friendly messages
 */
export function handleError(error: any, verbose = false): void {
  // Determine if it's a known error type
  const isGHPError = error instanceof GHPError;
  
  // Get the exit code
  const exitCode = isGHPError ? error.exitCode : ExitCode.GeneralError;
  
  // Format the error message
  let message: string;
  
  if (error instanceof GitHubAPIError && error.response) {
    if (verbose) {
      message = `GitHub API Error: ${error.message}\nResponse: ${JSON.stringify(error.response, null, 2)}`;
    } else {
      message = `GitHub API Error: ${error.message}`;
    }
  } else if (error.message) {
    message = error.message;
  } else {
    message = String(error);
  }
  
  // Print error message
  console.error(`Error: ${message}`);
  
  // In verbose mode, print stack trace for debugging
  if (verbose && error.stack) {
    console.error('\nStack trace:');
    console.error(error.stack);
  }
  
  // Exit process with appropriate code
  process.exit(exitCode);
}

/**
 * Wrap a function to handle errors
 */
export function wrapWithErrorHandler<T extends any[], R>(
  fn: (...args: T) => Promise<R>,
  verbose = false
): (...args: T) => Promise<R> {
  return async (...args: T): Promise<R> => {
    try {
      return await fn(...args);
    } catch (error) {
      handleError(error, verbose);
      // This line is never reached, but TypeScript needs a return statement
      throw error;
    }
  };
} 