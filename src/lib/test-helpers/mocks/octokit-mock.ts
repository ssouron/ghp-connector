/**
 * Mocks pour l'API GitHub (Octokit)
 */

import { Octokit } from 'octokit';
import { GitHubClient } from '../../github/client';
import { createMockIssue, createMockIssueList } from '../mock-github';
import { mock, MockProxy } from 'jest-mock-extended';

/**
 * Options pour le mock Octokit
 */
export interface OctokitMockOptions {
  /** Nombre d'issues à créer par défaut */
  defaultIssueCount?: number;
  /** Réponses personnalisées pour les requêtes */
  customResponses?: Record<string, any>;
}

/**
 * Crée un mock pour Octokit
 */
export function mockOctokit(options: OctokitMockOptions = {}) {
  const { defaultIssueCount = 5, customResponses = {} } = options;
  
  // Créer une implémentation partielle de Octokit avec les méthodes mockeés
  const octokitMock = {
    rest: {
      repos: {
        get: jest.fn().mockImplementation(async () => ({
          data: {
            id: 123456,
            name: 'test-repo',
            full_name: 'test-owner/test-repo',
            private: false,
            owner: {
              login: 'test-owner',
              id: 12345,
              type: 'User'
            },
            html_url: 'https://github.com/test-owner/test-repo',
            description: 'A test repository for unit tests',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            ...customResponses.repo
          },
          status: 200,
          headers: {},
          url: 'https://api.github.com/repos/test-owner/test-repo'
        }))
      },
      issues: {
        listForRepo: jest.fn().mockImplementation(async () => ({
          data: customResponses.issues?.list || createMockIssueList(defaultIssueCount),
          status: 200,
          headers: {},
          url: 'https://api.github.com/repos/test-owner/test-repo/issues'
        })),
        get: jest.fn().mockImplementation(async ({ issue_number }: { issue_number: number }) => ({
          data: customResponses.issues?.get?.[issue_number] || createMockIssue(issue_number, `Issue ${issue_number}`),
          status: 200,
          headers: {},
          url: `https://api.github.com/repos/test-owner/test-repo/issues/${issue_number}`
        })),
        create: jest.fn().mockImplementation(async ({ title, body, ...options }: { 
          title: string; 
          body?: string; 
          [key: string]: any 
        }) => ({
          data: createMockIssue(Date.now(), title, { body, ...options }),
          status: 201,
          headers: {},
          url: 'https://api.github.com/repos/test-owner/test-repo/issues'
        })),
        update: jest.fn().mockImplementation(async ({ issue_number, ...updates }: { 
          issue_number: number;
          [key: string]: any
        }) => ({
          data: createMockIssue(issue_number, `Updated Issue ${issue_number}`, updates),
          status: 200,
          headers: {},
          url: `https://api.github.com/repos/test-owner/test-repo/issues/${issue_number}`
        }))
      }
    },
    graphql: jest.fn().mockImplementation(async (query: string, variables?: Record<string, any>) => {
      // Si une réponse personnalisée est fournie pour cette requête, l'utiliser
      const queryKey = query.replace(/\s+/g, ' ').trim();
      if (customResponses.graphql?.[queryKey]) {
        return customResponses.graphql[queryKey](variables);
      }
      
      // Réponse par défaut
      return {
        repository: {
          id: 'R_123456',
          name: 'test-repo',
          owner: { login: 'test-owner' },
          issues: {
            nodes: createMockIssueList(3)
          }
        }
      };
    })
  };
  
  return octokitMock as unknown as Octokit;
}

// Type pour les issues renvoyées par le mock
interface MockIssue {
  id: number;
  number: number;
  title: string;
  body: string;
  state: string;
  html_url: string;
  labels: Array<{ id: number, name: string, color: string }>;
  assignees: Array<{ login: string, id: number }>;
  created_at: string;
  updated_at: string;
  closed_at: string | null;
  user: {
    login: string;
    id: number;
    avatar_url: string;
    html_url: string;
  };
}

/**
 * Crée un mock pour GitHubClient
 */
export function mockGitHubClient(options: OctokitMockOptions = {}): MockProxy<GitHubClient> & GitHubClient {
  const clientMock = mock<GitHubClient>();
  const mockIssueList = options.customResponses?.issues?.list || createMockIssueList(options.defaultIssueCount || 5);
  
  // Mock pour getRepository
  clientMock.getRepository.mockResolvedValue({
    id: 123456,
    name: 'test-repo',
    full_name: 'test-owner/test-repo',
    private: false,
    owner: {
      login: 'test-owner',
      id: 12345,
      type: 'User'
    },
    html_url: 'https://github.com/test-owner/test-repo',
    description: 'A test repository for unit tests',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    ...options.customResponses?.repo
  });
  
  // Mock pour listIssues
  clientMock.listIssues.mockResolvedValue(mockIssueList);
  
  // Mock pour getIssue
  clientMock.getIssue.mockImplementation(async (issueNumber: number) => {
    const customIssue = options.customResponses?.issues?.get?.[issueNumber];
    if (customIssue) return customIssue;
    
    const issue = mockIssueList.find((i: MockIssue) => i.number === issueNumber);
    if (issue) return issue;
    
    return createMockIssue(issueNumber, `Issue ${issueNumber}`);
  });
  
  // Mock pour createIssue
  clientMock.createIssue.mockImplementation(async (title: string, body?: string, opts?: any) => 
    createMockIssue(Date.now(), title, { body, ...opts })
  );
  
  // Mock pour updateIssue
  clientMock.updateIssue.mockImplementation(async (issueNumber: number, updates: any) => 
    createMockIssue(issueNumber, `Updated Issue ${issueNumber}`, updates)
  );
  
  // Mock pour graphql
  clientMock.graphql.mockImplementation(async (query: string, variables?: Record<string, any>) => {
    // Si une réponse personnalisée est fournie pour cette requête, l'utiliser
    const queryKey = query.replace(/\s+/g, ' ').trim();
    if (options.customResponses?.graphql?.[queryKey]) {
      return options.customResponses.graphql[queryKey](variables);
    }
    
    // Réponse par défaut
    return {
      repository: {
        id: 'R_123456',
        name: 'test-repo',
        owner: { login: 'test-owner' },
        issues: {
          nodes: createMockIssueList(3)
        }
      }
    };
  });
  
  return clientMock;
} 