# Rapports de couverture de code

Ce document explique comment utiliser et interpréter les rapports de couverture de code dans GHP Connector.

## Présentation

La couverture de code est une métrique qui mesure le pourcentage de code source exécuté pendant les tests. C'est un indicateur important pour identifier les parties du code qui ne sont pas testées ou insuffisamment testées.

GHP Connector exige une couverture minimale de 80% pour les modules testés (actuellement les modules dans `src/lib/config`, `src/lib/errors` et `src/lib/formatters`), ce qui signifie que :
- 80% des lignes de code doivent être exécutées pendant les tests
- 80% des branches conditionnelles doivent être testées
- 80% des fonctions doivent être couvertes
- 80% des instructions doivent être couvertes

À mesure que de nouveaux modules sont développés et testés, ils seront ajoutés à la liste des modules soumis au seuil de couverture de 80%.

## Génération des rapports de couverture

Pour générer un rapport de couverture de code, utilisez la commande :

```bash
npm run test:coverage
```

Cette commande exécute les tests et génère un rapport détaillé dans le dossier `coverage/`.

Pour vérifier si votre code respecte les seuils minimaux de couverture (80%), utilisez :

```bash
npm run test:coverage:check
```

Cette commande échouera si la couverture est inférieure aux seuils définis.

## Interprétation des rapports

### Rapport dans le terminal

Le rapport affiché dans le terminal donne un aperçu rapide de la couverture :

```
--------------|---------|----------|---------|---------|-------------------
File          | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
--------------|---------|----------|---------|---------|-------------------
All files     |   85.71 |    83.33 |   84.62 |   85.71 |                   
 src          |   82.35 |    80.00 |   81.82 |   82.35 |                   
  cli.ts      |   90.91 |    85.71 |   88.89 |   90.91 | 45-46,78          
  index.ts    |   73.68 |    75.00 |   75.00 |   73.68 | 12-15,22-25       
 src/commands |   89.47 |    85.71 |   87.50 |   89.47 |                   
  issue.ts    |   89.47 |    85.71 |   87.50 |   89.47 | 102-105           
--------------|---------|----------|---------|---------|-------------------
```

Les colonnes indiquent :
- **% Stmts** : Pourcentage d'instructions couvertes
- **% Branch** : Pourcentage de branches conditionnelles couvertes
- **% Funcs** : Pourcentage de fonctions couvertes
- **% Lines** : Pourcentage de lignes couvertes
- **Uncovered Line #s** : Numéros des lignes non couvertes

### Rapport HTML

Un rapport HTML plus détaillé est disponible dans `coverage/lcov-report/index.html`. Pour le consulter :

1. Ouvrez ce fichier dans votre navigateur
2. Naviguez dans l'arborescence des fichiers
3. Les lignes en vert sont couvertes, les lignes en rouge ne le sont pas

## Amélioration de la couverture

Pour améliorer la couverture de code :

1. **Identifiez les zones non couvertes** : Consultez les rapports pour identifier les parties du code non testées
2. **Ajoutez des tests ciblés** : Écrivez des tests spécifiquement pour les fonctionnalités non couvertes
3. **Testez les cas limites** : Assurez-vous de tester les conditions aux limites et les chemins d'erreur
4. **Vérifiez les branches conditionnelles** : Testez toutes les branches des instructions if/else et des opérateurs ternaires

## Intégration CI/CD

La vérification de la couverture est intégrée au pipeline CI/CD :

1. Chaque pull request et push sur la branche principale déclenchent des tests
2. La couverture de code est vérifiée par rapport aux seuils définis
3. Les rapports de couverture sont générés et disponibles comme artefacts

## Bonnes pratiques

- Ne baissez pas les seuils de couverture sans discussion préalable
- Écrivez les tests en même temps que le code
- Prioritisez les tests sur la logique métier critique
- Ne cherchez pas à atteindre 100% de couverture à tout prix, certaines parties du code peuvent être difficiles à tester avec un bon rapport coût/bénéfice 