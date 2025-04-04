/**
 * Tests for issue commands
 */

import { Command } from 'commander';
import { createMockIssueList } from '../lib/test-helpers/mock-github';
import { registerIssueCommands } from './issue';

// Mock dependencies
jest.mock('../lib', () => {
  const originalLib = jest.requireActual('../lib');
  return {
    ...originalLib,
    GitHubClient: {
      fromConfig: jest.fn().mockReturnValue({
        listIssues: jest.fn().mockResolvedValue(createMockIssueList(3)),
        getIssue: jest.fn().mockImplementation((_id) => Promise.resolve(createMockIssueList(1)[0])),
        createIssue: jest
          .fn()
          .mockImplementation((_title, _body, _options) => Promise.resolve(createMockIssueList(1)[0])),
        updateIssue: jest.fn().mockImplementation((_id, _options) => Promise.resolve(createMockIssueList(1)[0])),
      }),
    },
    loadConfig: jest.fn().mockReturnValue({
      github: {
        owner: 'test-owner',
        repo: 'test-repo',
      },
      defaults: {
        issues: {
          state: 'open',
        },
      },
    }),
    formatOutput: jest.fn().mockImplementation((data) => JSON.stringify(data)),
    wrapWithErrorHandler: jest.fn().mockImplementation((fn) => fn),
    cmdArgsToConfig: jest.fn().mockReturnValue({}),
    ValidationError: class ValidationError extends Error {
      constructor(message: string) {
        super(message);
        this.name = 'ValidationError';
      }
    },
  };
});

// Spy on console.log
const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();

describe('Issue Commands', () => {
  let program: Command;

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();

    // Create a new Command instance
    program = new Command();
    registerIssueCommands(program);
  });

  afterAll(() => {
    // Restore console.log
    consoleLogSpy.mockRestore();
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
  });

  describe('issue get', () => {
    it('devrait enregistrer la commande get', () => {
      const getCommand = program.commands[0].commands.find((cmd) => cmd.name() === 'get');
      expect(getCommand).toBeDefined();
      expect(getCommand?.description()).toBe('Get details of a specific issue');
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
