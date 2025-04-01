# GitHub Enterprise Configuration

This document describes how to configure and use GHP Connector with GitHub Enterprise instances.

## Overview

GHP Connector supports GitHub Enterprise instances through a dedicated configuration system that handles:

- Custom Enterprise URLs
- API version compatibility
- SSL/TLS validation
- Rate limiting
- Health monitoring

## Configuration

### Basic Configuration

Create or update your `.ghprc.json` file with the following structure:

```json
{
  "enterprise": {
    "baseUrl": "https://github.your-company.com",
    "apiVersion": "v3",
    "verifySSL": true
  }
}
```

### Advanced Configuration

For more control, you can use the following extended configuration:

```json
{
  "enterprise": {
    "baseUrl": "https://github.your-company.com",
    "apiVersion": "v3",
    "verifySSL": true,
    "headers": {
      "Custom-Header": "value"
    },
    "rateLimit": {
      "maxRequests": 5000,
      "windowMs": 3600000
    }
  }
}
```

### Configuration Options

| Option                  | Type    | Required | Default | Description                                     |
| ----------------------- | ------- | -------- | ------- | ----------------------------------------------- |
| `baseUrl`               | string  | Yes      | -       | The base URL of your GitHub Enterprise instance |
| `apiVersion`            | string  | Yes      | "v3"    | The GitHub API version to use                   |
| `verifySSL`             | boolean | No       | true    | Whether to verify SSL/TLS certificates          |
| `headers`               | object  | No       | -       | Custom headers to include in all requests       |
| `rateLimit.maxRequests` | number  | No       | 5000    | Maximum number of requests per time window      |
| `rateLimit.windowMs`    | number  | No       | 3600000 | Time window for rate limiting in milliseconds   |

## Environment Variables

The following environment variables can be used to override configuration values:

- `GITHUB_ENTERPRISE_URL`: Overrides the `baseUrl` setting
- `GITHUB_ENTERPRISE_API_VERSION`: Overrides the `apiVersion` setting
- `GITHUB_ENTERPRISE_VERIFY_SSL`: Overrides the `verifySSL` setting (use "false" to disable)

## Health Checks

GHP Connector includes built-in health checking for Enterprise instances. You can check the health status using:

```bash
ghp enterprise health
```

This will return information about:

- Connection status
- API version compatibility
- Response time
- Any error conditions

## Error Handling

The following error conditions are handled automatically:

- Connection failures
- Timeout issues
- SSL/TLS certificate problems
- API version incompatibility
- Rate limiting
- Authentication failures
- Access denied errors

## Migration Guide

### From GitHub.com to Enterprise

1. Update your configuration file:

   ```json
   {
     "enterprise": {
       "baseUrl": "https://github.your-company.com",
       "apiVersion": "v3"
     }
   }
   ```

2. Verify your authentication token has the correct permissions for your Enterprise instance

3. Test the connection:

   ```bash
   ghp enterprise health
   ```

4. If using custom SSL certificates, you may need to set `verifySSL` to `false` or configure your system's certificate store

### Troubleshooting

Common issues and solutions:

1. **SSL Certificate Errors**

   - Ensure your Enterprise instance's SSL certificate is valid
   - If using self-signed certificates, set `verifySSL` to `false` or add the certificate to your system's trust store

2. **API Version Mismatch**

   - Check your Enterprise instance's supported API versions
   - Update the `apiVersion` setting accordingly

3. **Rate Limiting**

   - Monitor your API usage
   - Adjust the `rateLimit` settings if needed

4. **Authentication Issues**
   - Verify your token has the correct permissions
   - Check if your Enterprise instance requires additional authentication headers

## Security Considerations

1. **SSL/TLS**

   - Always use HTTPS for Enterprise connections
   - Verify SSL certificates by default
   - Only disable SSL verification in development environments

2. **Authentication**

   - Use environment variables for sensitive configuration
   - Rotate tokens regularly
   - Use the minimum required permissions

3. **Rate Limiting**
   - Monitor API usage
   - Implement appropriate rate limits
   - Handle rate limit errors gracefully

## Best Practices

1. **Configuration Management**

   - Use environment variables for sensitive data
   - Keep configuration files in version control
   - Document any custom configurations

2. **Error Handling**

   - Implement proper error logging
   - Set up monitoring for health checks
   - Have fallback procedures for common issues

3. **Performance**
   - Monitor response times
   - Implement appropriate timeouts
   - Cache responses when possible
