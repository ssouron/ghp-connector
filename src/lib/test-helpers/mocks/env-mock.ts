/**
 * Mocks pour les variables d'environnement
 */

/**
 * Options pour le mock des variables d'environnement
 */
export interface EnvMockOptions {
  /** Variables d'environnement à définir */
  vars?: Record<string, string | undefined>;
  /** Variables à supprimer */
  unset?: string[];
}

/**
 * Sauvegarde les variables d'environnement actuelles
 * @returns Copie des variables d'environnement
 */
function backupEnv(): Record<string, string | undefined> {
  return { ...process.env };
}

/**
 * Restaure les variables d'environnement à partir d'une sauvegarde
 * @param backup Sauvegarde des variables d'environnement
 */
function restoreEnv(backup: Record<string, string | undefined>): void {
  // Supprime toutes les variables qui n'étaient pas dans la sauvegarde
  for (const key of Object.keys(process.env)) {
    if (!(key in backup)) {
      delete process.env[key];
    }
  }

  // Restaure les variables sauvegardées
  for (const [key, value] of Object.entries(backup)) {
    if (value === undefined) {
      delete process.env[key];
    } else {
      process.env[key] = value;
    }
  }
}

/**
 * Mock pour les variables d'environnement
 *
 * @example
 * ```
 * // Dans un test
 * const restoreEnv = mockEnv({
 *   vars: {
 *     GITHUB_TOKEN: 'mock-token',
 *     NODE_ENV: 'test'
 *   },
 *   unset: ['HOME']
 * });
 *
 * // Puis, dans le teardown du test
 * afterEach(() => {
 *   restoreEnv();
 * });
 * ```
 *
 * @param options Options de configuration
 * @returns Fonction pour restaurer les variables d'environnement
 */
export function mockEnv(options: EnvMockOptions = {}): () => void {
  const backup = backupEnv();

  // Définir les variables
  if (options.vars) {
    for (const [key, value] of Object.entries(options.vars)) {
      if (value === undefined) {
        delete process.env[key];
      } else {
        process.env[key] = value;
      }
    }
  }

  // Supprimer les variables
  if (options.unset) {
    for (const key of options.unset) {
      delete process.env[key];
    }
  }

  // Retourner la fonction de restauration
  return () => restoreEnv(backup);
}

/**
 * Configure les variables d'environnement pour les tests GitHub
 * @returns Fonction pour restaurer les variables d'environnement
 */
export function mockGitHubEnv(): () => void {
  return mockEnv({
    vars: {
      GITHUB_TOKEN: 'mock-github-token-for-tests',
      GITHUB_API_URL: 'https://api.github.com',
      GITHUB_REPOSITORY: 'test-owner/test-repo',
    },
  });
}

/**
 * Configure les variables d'environnement pour les tests en mode CI
 * @returns Fonction pour restaurer les variables d'environnement
 */
export function mockCIEnv(): () => void {
  return mockEnv({
    vars: {
      CI: 'true',
      GITHUB_ACTIONS: 'true',
      GITHUB_WORKFLOW: 'Test Workflow',
      GITHUB_RUN_ID: '12345',
      GITHUB_TOKEN: 'mock-github-token-for-ci',
    },
  });
}
