/**
 * Tests for issue commands
 */

import { Command } from 'commander';
import { registerIssueCommands } from './issue';
import { createMockIssue, createMockCommentList } from '../lib/test-helpers/mock-github';

// Mock dependencies using jest.mock with factory functions
jest.mock('../lib', () => {
  const originalLib = jest.requireActual('../lib');
  return {
    ...originalLib,
    GitHubClient: {
      fromConfig: jest.fn(),
    },
    loadConfig: jest.fn(),
    wrapWithErrorHandler: jest.fn((fn: (...args: any[]) => any) => fn),
    cmdArgsToConfig: jest.fn(),
    ValidationError: class ValidationError extends Error {
      constructor(message: string) {
        super(message);
        this.name = 'ValidationError';
      }
    },
  };
});

// Mock formatters
jest.mock('../lib/formatters', () => {
  return {
    defaultFactory: {
      create: jest.fn(),
    },
    FormatType: jest.requireActual('../lib/formatters').FormatType,
  };
});

// Mock config module
jest.mock('../lib/config', () => ({
  loadConfig: jest.fn(),
  cmdArgsToConfig: jest.fn(),
}));

describe('Issue Commands', () => {
  // Variables for mock references
  let program: Command;
  let mockClient: {
    listIssues: jest.Mock;
    getIssue: jest.Mock;
    getIssueComments: jest.Mock;
    createIssue: jest.Mock;
    updateIssue: jest.Mock;
    getRepository: jest.Mock;
    graphql: jest.Mock;
  };
  let mockFormat: jest.Mock;
  let consoleOutput: any[];
  let processArgvMock: string[];

  // Store original implementations
  const originalConsoleLog = console.log;
  const originalProcessArgv = process.argv;

  // Import modules in a type-safe way
  // These will be imported once the mocks are set up
  let GitHubClientModule: any;
  let formatterFactory: any;
  let configModule: any;

  beforeEach(() => {
    // Clear all mocks
    jest.clearAllMocks();

    // Setup mock client
    mockClient = {
      listIssues: jest.fn(),
      getIssue: jest.fn(),
      getIssueComments: jest.fn(),
      createIssue: jest.fn(),
      updateIssue: jest.fn(),
      getRepository: jest.fn(),
      graphql: jest.fn(),
    } as unknown as {
      listIssues: jest.Mock;
      getIssue: jest.Mock;
      getIssueComments: jest.Mock;
      createIssue: jest.Mock;
      updateIssue: jest.Mock;
      getRepository: jest.Mock;
      graphql: jest.Mock;
    };

    // Configure GitHubClient mock
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    GitHubClientModule = require('../lib').GitHubClient;
    GitHubClientModule.fromConfig.mockReturnValue(mockClient);

    // Mock format function
    mockFormat = jest.fn((data: any) => JSON.stringify(data, null, 2));
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    formatterFactory = require('../lib/formatters').defaultFactory;
    formatterFactory.create.mockReturnValue({ format: mockFormat });

    // Configure loadConfig mock
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    configModule = require('../lib/config');
    configModule.loadConfig.mockReturnValue({
      github: {
        owner: 'test-owner',
        repo: 'test-repo',
        token: 'test-token',
      },
      defaults: {
        issues: {
          state: 'open',
        },
      },
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    configModule.cmdArgsToConfig.mockImplementation((args: any) => args);

    // Mock console.log
    consoleOutput = [];
    console.log = jest.fn((...args: any[]) => {
      consoleOutput.push(args);
    });

    // Mock process.argv
    processArgvMock = ['node', 'script.js'];
    Object.defineProperty(process, 'argv', {
      get: jest.fn(() => processArgvMock),
      set: jest.fn((val: string[]) => {
        processArgvMock = val;
      }),
      configurable: true,
    });

    // Create a new program instance and register commands
    program = new Command();
    registerIssueCommands(program);
  });

  afterAll(() => {
    // Restore original functions
    console.log = originalConsoleLog;
    Object.defineProperty(process, 'argv', {
      value: originalProcessArgv,
      configurable: true,
    });
  });

  describe('issue list', () => {
    it('devrait enregistrer la commande list', () => {
      const listCommand = program.commands[0].commands.find((cmd) => cmd.name() === 'list');
      expect(listCommand).toBeDefined();
      expect(listCommand?.description()).toBe('List issues in a repository');
    });

    it('devrait contenir toutes les options de filtrage', () => {
      const listCommand = program.commands[0].commands.find((cmd) => cmd.name() === 'list');
      const options = listCommand?.options.map((opt) => opt.flags);

      expect(options).toContain('-s, --state <state>');
      expect(options).toContain('-l, --limit <limit>');
      expect(options).toContain('-a, --assignee <assignee>');
      expect(options).toContain('-L, --label <labels>');
      expect(options).toContain('-S, --sort <sort>');
      expect(options).toContain('-d, --direction <direction>');
      expect(options).toContain('-m, --milestone <milestone>');
      expect(options).toContain('-c, --creator <creator>');
      expect(options).toContain('-M, --mentioned <mentioned>');
      expect(options).toContain('--since <date>');
    });

    it('devrait définir les valeurs par défaut appropriées', () => {
      const listCommand = program.commands[0].commands.find((cmd) => cmd.name() === 'list');

      const stateOption = listCommand?.options.find((opt) => opt.flags.includes('--state'));
      const limitOption = listCommand?.options.find((opt) => opt.flags.includes('--limit'));
      const sortOption = listCommand?.options.find((opt) => opt.flags.includes('--sort'));
      const directionOption = listCommand?.options.find((opt) => opt.flags.includes('--direction'));

      expect(stateOption?.defaultValue).toBe('open');
      expect(limitOption?.defaultValue).toBe('10');
      expect(sortOption?.defaultValue).toBe('created');
      expect(directionOption?.defaultValue).toBe('desc');
    });

    it('should list issues with default options', async () => {
      // Mock the API response
      const mockIssues = [createMockIssue(1, 'Issue 1'), createMockIssue(2, 'Issue 2')];
      mockClient.listIssues.mockResolvedValue(mockIssues);

      // Parse the command
      await program.parseAsync(['node', 'script.js', 'issue', 'list']);

      // Check that the API was called with correct options
      expect(mockClient.listIssues).toHaveBeenCalledWith({
        state: 'open',
        per_page: 10,
        sort: 'created',
        direction: 'desc',
      });

      // Check that the output was formatted
      expect(consoleOutput.length).toBe(1);
      expect(consoleOutput[0][0]).toContain('Issue 1');
    });
  });

  describe('issue get', () => {
    it('devrait enregistrer la commande get', () => {
      const getCommand = program.commands[0].commands.find((cmd) => cmd.name() === 'get');
      expect(getCommand).toBeDefined();
      expect(getCommand?.description()).toBe('Get details of a specific issue');
    });

    it('should get a single issue by number', async () => {
      // Mock the API response
      const mockIssue = createMockIssue(123, 'Test Issue 123');
      mockClient.getIssue.mockResolvedValue(mockIssue);

      // Parse the command
      await program.parseAsync(['node', 'script.js', 'issue', 'get', '123']);

      // Check that the API was called with correct issue number
      expect(mockClient.getIssue).toHaveBeenCalledWith(123);

      // Check that the output was formatted
      expect(consoleOutput.length).toBe(1);
      expect(consoleOutput[0][0]).toContain('Test Issue 123');
    });

    it('should fetch and include comments when --with-comments is specified', async () => {
      // Mock the API responses
      const mockIssue = createMockIssue(123, 'Test Issue 123');
      const mockComments = createMockCommentList(123, 2);

      mockClient.getIssue.mockResolvedValue(mockIssue);
      mockClient.getIssueComments.mockResolvedValue(mockComments);

      // Set process.argv to include the --with-comments flag
      processArgvMock = ['node', 'script.js', 'issue', 'get', '123', '--with-comments'];

      // Parse the command
      await program.parseAsync(['node', 'script.js', 'issue', 'get', '123', '--with-comments']);

      // Check that both APIs were called
      expect(mockClient.getIssue).toHaveBeenCalledWith(123);
      expect(mockClient.getIssueComments).toHaveBeenCalledWith(123);

      // Check that the formatter was called with both issue and comments
      expect(mockFormat).toHaveBeenCalled();

      // Get the first argument of the format call (the data)
      const formattedData = mockFormat.mock.calls[0][0];

      // Check that comments were attached to the issue
      expect(formattedData).toHaveProperty('comments_data');
      expect(formattedData.comments_data).toEqual(mockComments);
    });

    it('should handle non-existent issues', async () => {
      // Simply verify that the getIssue method is called with the right issue number
      mockClient.getIssue.mockImplementation((issueId: number) => {
        // Just throw a 404 error when called
        throw new Error(`Issue #${issueId} not found in test-owner/test-repo or you don't have access.`);
      });

      // Try to parse the command but catch the error
      try {
        await program.parseAsync(['node', 'script.js', 'issue', 'get', '999']);
      } catch (error) {
        // Just verify that the error message contains "not found"
        expect((error as Error).message).toContain('not found');
      }

      // Verify that getIssue was called with the right issue number
      expect(mockClient.getIssue).toHaveBeenCalledWith(999);
    });
  });

  describe('issue create', () => {
    it('devrait enregistrer la commande create', () => {
      const createCommand = program.commands[0].commands.find((cmd) => cmd.name() === 'create');
      expect(createCommand).toBeDefined();
      expect(createCommand?.description()).toBe('Create a new issue');
    });

    it('devrait exiger un titre', () => {
      const createCommand = program.commands[0].commands.find((cmd) => cmd.name() === 'create');
      const titleOption = createCommand?.options.find((opt) => opt.flags.includes('--title'));

      expect(titleOption).toBeDefined();
      expect(titleOption?.required).toBe(true);
    });
  });
});
