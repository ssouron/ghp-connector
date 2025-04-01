import { Command } from 'commander';
import { EnterpriseConfigManager } from '../lib/config/enterprise';
import { EnterpriseValidator } from '../lib/auth/enterprise-validator';
import { EnterpriseHealthChecker } from '../lib/health/enterprise-health';
import { ConfigError } from '../lib/errors/config-error';

export function createEnterpriseCommand(): Command {
  const command = new Command('enterprise');

  command
    .description('Manage GitHub Enterprise configuration and health checks')
    .addCommand(createHealthCommand())
    .addCommand(createValidateCommand())
    .addCommand(createConfigCommand());

  return command;
}

function createHealthCommand(): Command {
  return new Command('health').description('Check the health of the GitHub Enterprise instance').action(async () => {
    try {
      const configManager = new EnterpriseConfigManager();
      const config = configManager.getConfig();
      const checker = new EnterpriseHealthChecker(config);
      const status = await checker.checkHealth();

      if (status.isHealthy) {
        console.log('✅ Enterprise instance is healthy');
        console.log(`📊 API Version: ${status.apiVersion}`);
        console.log(`⚡ Response Time: ${status.responseTime}ms`);
      } else {
        console.error('❌ Enterprise instance is unhealthy');
        console.error(`📊 API Version: ${status.apiVersion}`);
        console.error(`⚡ Response Time: ${status.responseTime}ms`);
        console.error(`❌ Error: ${status.error}`);
        process.exit(1);
      }
    } catch (error) {
      console.error('Failed to check enterprise health:', error instanceof Error ? error.message : 'Unknown error');
      process.exit(1);
    }
  });
}

function createValidateCommand(): Command {
  return new Command('validate').description('Validate the GitHub Enterprise configuration').action(async () => {
    try {
      const configManager = new EnterpriseConfigManager();
      const config = configManager.getConfig();
      const validator = new EnterpriseValidator(config);
      const result = await validator.validate();

      if (result.isValid) {
        console.log('✅ Enterprise configuration is valid');
        console.log(`📊 Base URL: ${result.config.baseUrl}`);
        console.log(`📊 API Version: ${result.config.apiVersion}`);
      } else {
        console.error('❌ Enterprise configuration is invalid');
        result.errors.forEach((error) => console.error(`❌ ${error}`));
        process.exit(1);
      }
    } catch (error) {
      console.error(
        'Failed to validate enterprise configuration:',
        error instanceof Error ? error.message : 'Unknown error'
      );
      process.exit(1);
    }
  });
}

function createConfigCommand(): Command {
  return new Command('config')
    .description('Configure GitHub Enterprise settings')
    .option('--base-url <url>', 'Set the base URL of the enterprise instance')
    .option('--api-version <version>', 'Set the API version')
    .option('--verify-ssl <boolean>', 'Enable or disable SSL verification')
    .option('--max-requests <number>', 'Set the maximum number of requests per time window')
    .option('--window-ms <number>', 'Set the time window for rate limiting in milliseconds')
    .action(async (options) => {
      try {
        const configManager = new EnterpriseConfigManager();
        const currentConfig = configManager.getConfig();
        const newConfig: Partial<typeof currentConfig> = {};

        if (options.baseUrl) newConfig.baseUrl = options.baseUrl;
        if (options.apiVersion) newConfig.apiVersion = options.apiVersion;
        if (options.verifySsl !== undefined) newConfig.verifySSL = options.verifySsl === 'true';
        if (options.maxRequests) {
          newConfig.rateLimit = {
            ...currentConfig.rateLimit,
            maxRequests: parseInt(options.maxRequests, 10),
          };
        }
        if (options.windowMs) {
          newConfig.rateLimit = {
            ...currentConfig.rateLimit,
            windowMs: parseInt(options.windowMs, 10),
          };
        }

        if (Object.keys(newConfig).length === 0) {
          console.log('Current Enterprise configuration:');
          console.log(JSON.stringify(currentConfig, null, 2));
          return;
        }

        configManager.updateConfig(newConfig);
        console.log('✅ Enterprise configuration updated successfully');
        console.log('New configuration:');
        console.log(JSON.stringify(configManager.getConfig(), null, 2));
      } catch (error) {
        if (error instanceof ConfigError) {
          console.error('Configuration error:', error.message);
        } else {
          console.error(
            'Failed to update enterprise configuration:',
            error instanceof Error ? error.message : 'Unknown error'
          );
        }
        process.exit(1);
      }
    });
}
