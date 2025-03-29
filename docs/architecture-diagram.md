# GHP Connector Architecture Diagram

The following diagram illustrates the architecture of the GHP Connector CLI application.

```mermaid
graph TD
    A[CLI Entry Point<br>ghp] --> B[Command Parser<br>Commander.js]
    B --> C{Command Routing}
    
    C --> D[Issue Commands]
    C --> E[Project Commands]
    C --> F[Other Commands]
    C --> G[Config Manager]
    C --> CM[Configuration<br>Commands]
    
    D --> H[GitHub Client<br>Octokit]
    E --> H
    F --> H
    G --> H
    
    H --> I[GitHub API]
    
    J[Configuration Sources] --> G
    J --> J1[Command Line Args<br>Highest Priority]
    J --> J2[Environment Vars<br>For Secrets]
    J --> J3[Local Config File<br>./.ghprc.json]
    J --> J4[Global Config File<br>~/.ghprc.json]
    J --> J5[Default Values<br>Lowest Priority]
    
    CM --> G
    CM --> CM1[Init Config]
    
    K[Error Handler] --> L[User Output]
    H --> K
    D --> K
    E --> K
    F --> K
```

## Component Descriptions

### Core Components

- **CLI Entry Point**: The main executable that users interact with (`ghp` command)
- **Command Parser**: Uses Commander.js to parse command line arguments and route to appropriate command handlers
- **Command Modules**: Separate modules for each resource type (issues, projects, etc.)
- **Config Manager**: Manages configuration from multiple sources
- **GitHub Client**: Octokit-based client for interacting with GitHub's API
- **Error Handler**: Centralized error processing and user-friendly messaging
- **Output Formatter**: Handles formatting output in different styles (human, JSON, etc.)

### Configuration System

The configuration system loads and merges settings from multiple sources:

1. **Command Line Arguments**: Highest priority, allows overriding settings for a single command
2. **Environment Variables**: For sensitive information like tokens
3. **Local Config File**: Project-specific settings in the current directory
4. **Global Config File**: User-specific settings in the home directory
5. **Default Values**: Fallback settings when none of the above are specified

Configuration is loaded at the start of each command execution and can be managed through dedicated configuration commands.

### Data Flow

1. User enters a command like `ghp issue list`
2. Commander.js parses the command and routes to the Issue command module
3. Configuration is loaded from all sources and merged according to precedence
4. Issue module validates input and calls appropriate GitHub client methods
5. GitHub client uses configuration settings to make API requests
6. Results are processed, formatted, and displayed to the user
7. Any errors are caught and handled by the error handler

## Design Principles

1. **Separation of Concerns**: Each component has a single responsibility
2. **Modularity**: Commands are organized by resource type for maintainability
3. **Consistent Interface**: All commands follow the same pattern
4. **Error Handling**: Centralized error processing with user-friendly messages
5. **Configuration Flexibility**: Multiple config sources with clear precedence 