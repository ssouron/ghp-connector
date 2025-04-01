import fs from 'fs/promises';
import { GHPConfig } from './index';

export class ConfigFileManager {
  private configPath: string;

  constructor(configPath: string) {
    this.configPath = configPath;
  }

  public async loadConfig(): Promise<GHPConfig> {
    try {
      console.log('📂 Loading configuration from:', this.configPath);
      const configData = await fs.readFile(this.configPath, 'utf-8');
      console.log('📄 Configuration file content:', configData);
      const config = JSON.parse(configData);
      console.log('✅ Configuration loaded successfully');
      return config;
    } catch (error) {
      console.error('❌ Error loading configuration:', error);
      throw error;
    }
  }
}
