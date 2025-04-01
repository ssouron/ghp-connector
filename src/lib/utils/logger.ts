/**
 * Secure logging utility
 * Ensures no sensitive data is logged
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  context: string;
  message: string;
  metadata?: Record<string, unknown>;
}

export class Logger {
  private context: string;
  private static readonly SENSITIVE_PATTERNS = [/token/i, /password/i, /secret/i, /key/i, /credential/i];

  constructor(context: string) {
    this.context = context;
  }

  /**
   * Create a new logger instance
   * @param context The context for the logger
   * @returns A new Logger instance
   */
  public static create(context: string): Logger {
    return new Logger(context);
  }

  /**
   * Log a debug message
   * @param message The message to log
   * @param metadata Optional metadata to include
   */
  public debug(message: string, metadata?: Record<string, unknown>): void {
    this.log('debug', message, metadata);
  }

  /**
   * Log an info message
   * @param message The message to log
   * @param metadata Optional metadata to include
   */
  public info(message: string, metadata?: Record<string, unknown>): void {
    this.log('info', message, metadata);
  }

  /**
   * Log a warning message
   * @param message The message to log
   * @param metadata Optional metadata to include
   */
  public warn(message: string, metadata?: Record<string, unknown>): void {
    this.log('warn', message, metadata);
  }

  /**
   * Log an error message
   * @param message The message to log
   * @param metadata Optional metadata to include
   */
  public error(message: string, metadata?: Record<string, unknown>): void {
    this.log('error', message, metadata);
  }

  /**
   * Internal logging method
   * @param level The log level
   * @param message The message to log
   * @param metadata Optional metadata to include
   */
  private log(level: LogLevel, message: string, metadata?: Record<string, unknown>): void {
    // Sanitize message and metadata
    const sanitizedMessage = this.sanitizeMessage(message);
    const sanitizedMetadata = metadata ? this.sanitizeMetadata(metadata) : undefined;

    const logEntry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      context: this.context,
      message: sanitizedMessage,
      metadata: sanitizedMetadata,
    };

    // Format and output the log entry
    const logLine = this.formatLogEntry(logEntry);
    console.log(logLine);
  }

  /**
   * Sanitize a message to remove sensitive data
   * @param message The message to sanitize
   * @returns The sanitized message
   */
  private sanitizeMessage(message: string): string {
    let sanitized = message;
    for (const pattern of Logger.SENSITIVE_PATTERNS) {
      if (pattern.test(message)) {
        sanitized = sanitized.replace(/[^\s]+(?=\s|$)/g, '[REDACTED]');
      }
    }
    return sanitized;
  }

  /**
   * Sanitize metadata to remove sensitive data
   * @param metadata The metadata to sanitize
   * @returns The sanitized metadata
   */
  private sanitizeMetadata(metadata: Record<string, unknown>): Record<string, unknown> {
    const sanitized: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(metadata)) {
      if (Logger.SENSITIVE_PATTERNS.some((pattern) => pattern.test(key))) {
        sanitized[key] = '[REDACTED]';
      } else if (typeof value === 'object' && value !== null) {
        sanitized[key] = this.sanitizeMetadata(value as Record<string, unknown>);
      } else {
        sanitized[key] = value;
      }
    }
    return sanitized;
  }

  /**
   * Format a log entry for output
   * @param entry The log entry to format
   * @returns The formatted log line
   */
  private formatLogEntry(entry: LogEntry): string {
    const { timestamp, level, context, message, metadata } = entry;
    let logLine = `[${timestamp}] ${level.toUpperCase()} [${context}]: ${message}`;

    if (metadata) {
      logLine += ` ${JSON.stringify(metadata)}`;
    }

    return logLine;
  }
}

/**
 * Create a new logger instance
 * @param context The context for the logger
 * @returns A new Logger instance
 */
export function createLogger(context: string): Logger {
  return Logger.create(context);
}
