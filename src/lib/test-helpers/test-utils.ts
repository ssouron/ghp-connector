/**
 * Test utilities
 * General purpose testing helpers
 */

import { existsSync, mkdirSync, writeFileSync, rmSync } from 'fs';
import { join } from 'path';
import { tmpdir } from 'os';

/**
 * Creates a temporary directory for tests
 * @param prefix Prefix for the directory name
 * @returns Path to the created directory
 */
export function createTempTestDir(prefix = 'ghp-test-'): string {
  const dirPath = join(tmpdir(), `${prefix}${Date.now()}-${Math.random().toString(36).substring(2, 10)}`);
  
  if (!existsSync(dirPath)) {
    mkdirSync(dirPath, { recursive: true });
  }
  
  return dirPath;
}

/**
 * Creates a temporary file with given content
 * @param content File content
 * @param fileName Optional file name
 * @param dirPath Optional directory path (creates temp dir if not provided)
 * @returns Path to the created file
 */
export function createTempTestFile(content: string, fileName?: string, dirPath?: string): string {
  const testDir = dirPath || createTempTestDir();
  const filePath = join(testDir, fileName || `test-${Date.now()}.json`);
  
  writeFileSync(filePath, content);
  return filePath;
}

/**
 * Creates a temporary configuration file for tests
 * @param config Configuration object
 * @param dirPath Optional directory path
 * @returns Path to the created config file
 */
export function createTempConfigFile(config: Record<string, any>, dirPath?: string): string {
  return createTempTestFile(JSON.stringify(config, null, 2), '.ghprc.json', dirPath);
}

/**
 * Cleans up temporary test files and directories
 * @param paths Paths to clean up
 */
export function cleanupTestFiles(...paths: string[]): void {
  for (const path of paths) {
    if (existsSync(path)) {
      rmSync(path, { recursive: true, force: true });
    }
  }
}

/**
 * Mocks process.env for testing
 * @param envVars Environment variables to set
 * @returns Function to restore original environment
 */
export function mockEnv(envVars: Record<string, string | undefined>): () => void {
  const originalEnv = { ...process.env };
  
  // Set mocked environment variables
  for (const [key, value] of Object.entries(envVars)) {
    if (value === undefined) {
      delete process.env[key];
    } else {
      process.env[key] = value;
    }
  }
  
  // Return restore function
  return () => {
    // Restore original environment
    for (const key of Object.keys(process.env)) {
      if (!(key in originalEnv)) {
        delete process.env[key];
      }
    }
    
    for (const [key, value] of Object.entries(originalEnv)) {
      process.env[key] = value;
    }
  };
} 