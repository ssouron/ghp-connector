# CONTEXT - GHP Connector

## Présentation du projet
GHP Connector est une bibliothèque Node.js open-source pour interagir avec les Issues et Projects GitHub via la ligne de commande. Elle est écrite en TypeScript, compilée en JavaScript et publiée comme package npm.

## État actuel du projet
- Initialisation du projet npm (version 0.0.1)
- Licence MIT
- Structure de base du projet mise en place
- Spécifications initiales documentées

## Objectifs principaux
- Fournir une interface en ligne de commande simple pour interagir avec GitHub
- Alternative aux commandes curl pour les utilisateurs et agents IA
- Focus initial sur les fonctionnalités liées aux issues GitHub

## Spécifications techniques importantes
- Le projet utilise TypeScript
- Installable comme package npm (globalement ou localement)
- Les paramètres par défaut (repo, projet) sont fournis par un fichier de configuration
- Les secrets (token GitHub, API keys) sont fournis par variables d'environnement
- Pas besoin de spécifier le repo dans chaque commande (--repo)

## Structure du projet
- `/src` - Code source TypeScript
- `/dist` - Code JavaScript compilé (généré)
- `/docs` - Documentation
- `/bin` - Scripts exécutables

## Configuration
- Configuration via fichier local (ex: `.ghprc.json`)
- Variables d'environnement pour les secrets (GITHUB_TOKEN, GITHUB_API_KEY)

## Commandes prévues
Format: `ghp [resource] [action] [options]`

Exemples:
```
ghp issue list
ghp issue create --title="Nouveau bug" --body="Description du bug"
ghp issue update --id=123 --status="closed"
```

## Notes pour le développement
- Ne pas réimplémenter d'arguments --repo dans les commandes
- Maintenir une interface simple et intuitive
- Prévoir des sorties formatées pour terminal et intégration avec d'autres outils

## Règles de langage et de code
- **Interactions humain/assistant** : principalement en français (parfois en anglais)
- **Code et commentaires** : exclusivement en anglais
- **Documentation technique** : exclusivement en anglais
- **Termes techniques** : conserver les termes anglais d'usage dans le métier
- **Noms de branches, tags et commits** : en anglais
- **Style d'interaction** : tutoiement dans les conversations en français
- **Documentation** : tous les documents doivent être liés depuis README.md ou CONTEXT.md (pas de documents orphelins)
- **Mise à jour documentation** : vérifier et mettre à jour la documentation avant chaque merge sur main

## Standards de commits et branches
- **Format de commit** : Conventional Commits (https://www.conventionalcommits.org/)
  - Structure: `<type>[optional scope]: <description>`
  - Types principaux: feat, fix, docs, style, refactor, test, chore
  - Exemple: `feat(issues): add list command implementation`
- **Noms de branches**:
  - Features: `feature/short-description`
  - Corrections: `fix/issue-description`
  - Documentation: `docs/what-is-changing`
  - Refactoring: `refactor/component-name`

## Méthodologie de travail
- Validation régulière pendant les implémentations complexes
- Explication et validation des solutions avant implémentation
- Pas de Pull Requests (développeur unique) - procéder par merges avec commits de merge
- Taille de review raisonnable

## Prochaines étapes
- Implémenter les fonctionnalités de base pour la gestion des issues
- Mettre en place les mécanismes de configuration
- Développer l'interface CLI

## Points à discuter
- Structure détaillée des commandes
- Format des données en entrée/sortie
- Stratégie de test

## Documentation du projet
- [README.md](./README.md) - Documentation principale du projet
- [docs/initial-specs.md](./docs/initial-specs.md) - Spécifications initiales 