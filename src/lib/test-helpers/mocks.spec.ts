/**
 * Tests des mocks pour les dépendances externes
 */

import { mockFs, mockVirtualFs } from './mocks/fs-mock';
import { mockOctokit, mockGitHubClient } from './mocks/octokit-mock';
import { mockEnv, mockGitHubEnv, mockCIEnv } from './mocks/env-mock';

describe('Mocks pour les dépendances externes', () => {
  describe('mockFs - Mock du système de fichiers', () => {
    it('devrait permettre de mocker les opérations sur les fichiers', () => {
      // Création du mock
      const { fs: fsMock, restore } = mockFs();
      
      // Test des méthodes mockées
      expect(fsMock.existsSync('test.txt')).toBe(false);
      expect(fsMock.existsSync).toHaveBeenCalledWith('test.txt');
      
      // Restauration des fonctions originales
      restore();
    });
    
    it('devrait permettre de créer un système de fichiers virtuel', () => {
      const initialFiles = {
        '/test.txt': 'Contenu du fichier test',
        '/config.json': '{ "key": "value" }'
      };
      
      const { fs: fsMock, restore, getVirtualFs } = mockVirtualFs(initialFiles);
      
      // Vérification de l'existence des fichiers
      expect(fsMock.existsSync('/test.txt')).toBe(true);
      expect(fsMock.existsSync('/config.json')).toBe(true);
      expect(fsMock.existsSync('/non-existant.txt')).toBe(false);
      
      // Lecture d'un fichier
      expect(fsMock.readFileSync('/test.txt', 'utf8')).toBe('Contenu du fichier test');
      
      // Écriture dans un fichier
      fsMock.writeFileSync('/new-file.txt', 'Nouveau contenu');
      expect(fsMock.existsSync('/new-file.txt')).toBe(true);
      expect(fsMock.readFileSync('/new-file.txt', 'utf8')).toBe('Nouveau contenu');
      
      // Suppression d'un fichier
      fsMock.rmSync('/test.txt');
      expect(fsMock.existsSync('/test.txt')).toBe(false);
      
      // Vérification du système de fichiers virtuel
      const virtualFs = getVirtualFs();
      expect(virtualFs['/config.json']).toBe('{ "key": "value" }');
      expect(virtualFs['/new-file.txt']).toBe('Nouveau contenu');
      expect(virtualFs['/test.txt']).toBeUndefined();
      
      // Restauration des fonctions originales
      restore();
    });
  });
  
  describe('mockOctokit - Mock de l\'API GitHub', () => {
    it('devrait permettre de mocker les appels à l\'API GitHub', async () => {
      const octokit = mockOctokit();
      
      // Test d'une méthode mockée
      const repoResponse = await octokit.rest.repos.get({
        owner: 'test-owner',
        repo: 'test-repo'
      });
      
      expect(repoResponse.data.name).toBe('test-repo');
      expect(repoResponse.data.owner.login).toBe('test-owner');
      
      // Test de la méthode issues.listForRepo
      const issuesResponse = await octokit.rest.issues.listForRepo({
        owner: 'test-owner',
        repo: 'test-repo'
      });
      
      expect(Array.isArray(issuesResponse.data)).toBe(true);
      expect(issuesResponse.data.length).toBe(5); // Valeur par défaut
    });
    
    it('devrait permettre de mocker le client GitHub', async () => {
      const client = mockGitHubClient();
      
      // Test des méthodes mockées
      const repo = await client.getRepository();
      expect(repo.name).toBe('test-repo');
      
      const issues = await client.listIssues();
      expect(Array.isArray(issues)).toBe(true);
      
      const issue = await client.getIssue(123);
      expect(issue.number).toBe(123);
      expect(issue.title).toBe('Issue 123');
    });
  });
  
  describe('mockEnv - Mock des variables d\'environnement', () => {
    it('devrait permettre de mocker les variables d\'environnement', () => {
      const originalNodeEnv = process.env.NODE_ENV;
      
      // Création du mock
      const restore = mockEnv({
        vars: {
          NODE_ENV: 'test',
          TEST_VAR: 'test-value'
        },
        unset: ['HOME']
      });
      
      // Vérification des variables
      expect(process.env.NODE_ENV).toBe('test');
      expect(process.env.TEST_VAR).toBe('test-value');
      expect(process.env.HOME).toBeUndefined();
      
      // Restauration des variables originales
      restore();
      
      // Vérification de la restauration
      expect(process.env.NODE_ENV).toBe(originalNodeEnv);
      expect(process.env.TEST_VAR).toBeUndefined();
    });
    
    it('devrait fournir des mocks prédéfinis pour GitHub', () => {
      const restore = mockGitHubEnv();
      
      expect(process.env.GITHUB_TOKEN).toBe('mock-github-token-for-tests');
      expect(process.env.GITHUB_API_URL).toBe('https://api.github.com');
      expect(process.env.GITHUB_REPOSITORY).toBe('test-owner/test-repo');
      
      restore();
    });
    
    it('devrait fournir des mocks prédéfinis pour l\'environnement CI', () => {
      const restore = mockCIEnv();
      
      expect(process.env.CI).toBe('true');
      expect(process.env.GITHUB_ACTIONS).toBe('true');
      expect(process.env.GITHUB_TOKEN).toBe('mock-github-token-for-ci');
      
      restore();
    });
  });
}); 