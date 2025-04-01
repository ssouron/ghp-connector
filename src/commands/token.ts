import { Command } from 'commander';
import { TokenValidator } from '../lib/auth/token-validator';
import { TokenManager } from '../lib/auth/token-manager';
import { loadConfig } from '../lib/config';

export function createTokenCommand(): Command {
  const command = new Command('token');

  command.description('Manage GitHub token').addCommand(createValidateCommand());

  return command;
}

function createValidateCommand(): Command {
  return new Command('validate').description('Validate GitHub token').action(async () => {
    try {
      console.log('🔍 Validating GitHub token...');

      const config = loadConfig();
      console.log('📋 Loaded configuration:', JSON.stringify(config, null, 2));

      const tokenManager = TokenManager.getInstance();
      tokenManager.initializeFromConfig(config.github);

      const validator = TokenValidator.getInstance();
      const result = await validator.validateToken();

      if (result.isValid) {
        console.log('✅ GitHub token is valid');
        console.log('📊 Scopes:', result.scopes.join(', '));
      } else {
        console.error('❌ GitHub token is invalid');
        if (result.missingScopes.length > 0) {
          console.error('❌ Missing scopes:', result.missingScopes.join(', '));
        }
        process.exit(1);
      }
    } catch (error) {
      console.error('Failed to validate GitHub token:', error instanceof Error ? error.message : 'Unknown error');
      process.exit(1);
    }
  });
}
