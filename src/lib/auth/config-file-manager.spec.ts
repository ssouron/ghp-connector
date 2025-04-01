import fs from 'fs';
import path from 'path';
import os from 'os';
import { ConfigFileManager } from './config-file-manager';
import { GitHubConfig } from '../config';

jest.mock('fs');
jest.mock('path');
jest.mock('os');

describe('ConfigFileManager', () => {
  let configManager: ConfigFileManager;
  const mockConfig: GitHubConfig = {
    owner: 'test',
    repo: 'test',
    token: '0123456789abcdef0123456789abcdef01234567',
  };

  beforeEach(() => {
    // Reset the singleton instance before each test
    (ConfigFileManager as any).instance = null;
    configManager = ConfigFileManager.getInstance();
    jest.clearAllMocks();
  });

  describe('getInstance', () => {
    it('should return the same instance on multiple calls', () => {
      const instance1 = ConfigFileManager.getInstance();
      const instance2 = ConfigFileManager.getInstance();
      expect(instance1).toBe(instance2);
    });
  });

  describe('findConfigFile', () => {
    it('should find config file in current directory', () => {
      const mockPath = '/current/dir/.ghprc.json';
      (fs.existsSync as jest.Mock).mockReturnValue(true);
      (fs.statSync as jest.Mock).mockReturnValue({ mode: 0o600 });
      (path.join as jest.Mock).mockReturnValue(mockPath);

      const result = configManager.findConfigFile();
      expect(result).toBe(mockPath);
    });

    it('should find config file in home directory', () => {
      const mockHomePath = '/home/user/.ghprc.json';
      (fs.existsSync as jest.Mock).mockReturnValueOnce(false).mockReturnValueOnce(true);
      (fs.statSync as jest.Mock).mockReturnValue({ mode: 0o600 });
      (path.join as jest.Mock).mockReturnValue(mockHomePath);
      (os.homedir as jest.Mock).mockReturnValue('/home/user');

      const result = configManager.findConfigFile();
      expect(result).toBe(mockHomePath);
    });

    it('should return null if no config file found', () => {
      (fs.existsSync as jest.Mock).mockReturnValue(false);
      const result = configManager.findConfigFile();
      expect(result).toBeNull();
    });

    it('should throw error for unsafe file permissions', () => {
      const mockPath = '/current/dir/.ghprc.json';
      (fs.existsSync as jest.Mock).mockReturnValue(true);
      (fs.statSync as jest.Mock).mockReturnValue({ mode: 0o644 });
      (path.join as jest.Mock).mockReturnValue(mockPath);

      expect(() => configManager.findConfigFile()).toThrow('unsafe permissions');
    });
  });

  describe('loadConfigFile', () => {
    it('should load and validate config file', () => {
      const mockPath = '/test/.ghprc.json';
      const mockContent = JSON.stringify(mockConfig);
      (fs.readFileSync as jest.Mock).mockReturnValue(mockContent);

      const result = configManager.loadConfigFile(mockPath);
      expect(result).toEqual(mockConfig);
    });

    it('should throw error for invalid JSON', () => {
      const mockPath = '/test/.ghprc.json';
      (fs.readFileSync as jest.Mock).mockReturnValue('invalid json');

      expect(() => configManager.loadConfigFile(mockPath)).toThrow('Failed to load config file');
    });
  });

  describe('createConfigFile', () => {
    it('should create config file with secure permissions', () => {
      const mockPath = '/test/.ghprc.json';
      (fs.writeFileSync as jest.Mock).mockImplementation(() => {});
      (fs.chmodSync as jest.Mock).mockImplementation(() => {});

      configManager.createConfigFile(mockPath, mockConfig);

      expect(fs.writeFileSync).toHaveBeenCalledWith(mockPath, JSON.stringify(mockConfig, null, 2));
      expect(fs.chmodSync).toHaveBeenCalledWith(mockPath, 0o600);
    });

    it('should throw error if file creation fails', () => {
      const mockPath = '/test/.ghprc.json';
      (fs.writeFileSync as jest.Mock).mockImplementation(() => {
        throw new Error('Write failed');
      });

      expect(() => configManager.createConfigFile(mockPath, mockConfig)).toThrow('Failed to create config file');
    });
  });
});
