# Test Helpers

Ce répertoire contient des utilitaires pour faciliter les tests dans GHP Connector.

## Mocks pour les dépendances externes

### Module fs (Système de fichiers)

```typescript
import { mockFs, mockVirtualFs } from './mocks/fs-mock';

// Mock simple du système de fichiers
const { fs: fsMock, restore } = mockFs();
// Utilisez fsMock comme vous utiliseriez fs
fsMock.existsSync('some-file.txt'); // Retourne false par défaut
// Restaurez les mocks quand vous avez terminé
restore();

// Mock avec système de fichiers virtuel
const initialFiles = {
  '/test.txt': 'Contenu du fichier',
  '/config.json': '{ "key": "value" }'
};
const { fs: fsMock, restore, getVirtualFs } = mockVirtualFs(initialFiles);
// Utilisez fsMock pour interagir avec le système de fichiers virtuel
fsMock.existsSync('/test.txt'); // true
fsMock.readFileSync('/test.txt', 'utf8'); // 'Contenu du fichier'
// Modifiez le système de fichiers
fsMock.writeFileSync('/new-file.txt', 'Nouveau contenu');
// Accédez au système de fichiers virtuel
const virtualFs = getVirtualFs();
console.log(virtualFs['/new-file.txt']); // 'Nouveau contenu'
// Restaurez les mocks quand vous avez terminé
restore();
```

### API GitHub (Octokit)

```typescript
import { mockOctokit, mockGitHubClient } from './mocks/octokit-mock';

// Mock de l'API Octokit
const octokit = mockOctokit({
  defaultIssueCount: 10, // Nombre d'issues à générer par défaut
  customResponses: {
    // Réponses personnalisées pour certaines requêtes
    repo: { name: 'custom-repo' },
    issues: {
      list: [/* issues personnalisées */],
      get: {
        123: {/* issue personnalisée pour #123 */}
      }
    }
  }
});

// Utilisez octokit comme vous utiliseriez l'API GitHub
const repo = await octokit.rest.repos.get({ owner: 'test-owner', repo: 'test-repo' });
const issues = await octokit.rest.issues.listForRepo({ owner: 'test-owner', repo: 'test-repo' });

// Mock du client GitHub
const client = mockGitHubClient({
  // Même options que pour mockOctokit
});

// Utilisez client comme vous utiliseriez GitHubClient
const repo = await client.getRepository();
const issues = await client.listIssues();
const issue = await client.getIssue(123);
```

### Variables d'environnement

```typescript
import { mockEnv, mockGitHubEnv, mockCIEnv } from './mocks/env-mock';

// Mock personnalisé des variables d'environnement
const restore = mockEnv({
  vars: {
    NODE_ENV: 'test',
    API_KEY: 'test-key'
  },
  unset: ['HOME'] // Variables à supprimer
});

// Utilisez les variables d'environnement
console.log(process.env.NODE_ENV); // 'test'
console.log(process.env.API_KEY); // 'test-key'
console.log(process.env.HOME); // undefined

// Restaurez les variables d'origine quand vous avez terminé
restore();

// Mocks prédéfinis
const restoreGitHub = mockGitHubEnv(); // Configure les variables GitHub pour les tests
const restoreCI = mockCIEnv(); // Configure les variables CI pour les tests
```

## Bonnes pratiques

1. **Isoler les tests** : Utilisez les mocks pour isoler vos tests des dépendances externes.
2. **Restaurer les mocks** : Appelez toujours la fonction `restore()` après vos tests pour éviter les effets de bord.
3. **Setup/Teardown** : Utilisez `beforeEach` et `afterEach` pour configurer et nettoyer les mocks.
4. **Test réaliste** : Configurez vos mocks pour qu'ils reflètent le comportement réel des dépendances.
5. **Ne pas sur-mocker** : Ne mockez que ce qui est nécessaire pour isoler vos tests.

## Exemple complet

```typescript
import { mockFs, mockGitHubEnv } from '../test-helpers';

describe('Mon composant', () => {
  let restoreFs;
  let restoreEnv;

  beforeEach(() => {
    // Setup
    restoreFs = mockFs().restore;
    restoreEnv = mockGitHubEnv();
  });

  afterEach(() => {
    // Teardown
    restoreFs();
    restoreEnv();
  });

  it('devrait faire quelque chose', () => {
    // Test avec mocks
  });
});
``` 