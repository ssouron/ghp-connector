# GHP Connector - Spécifications Initiales

## Présentation

GHP Connector est une bibliothèque Node.js open-source qui fournit une interface en ligne de commande pour interagir avec les Issues et Projects de GitHub. Elle est écrite en TypeScript pur, compilée en JavaScript et publiée en tant que package npm.

## Objectifs

L'objectif principal de cette bibliothèque est de permettre aux utilisateurs et aux agents IA d'interagir avec les issues GitHub via la ligne de commande de manière simple et lisible, en évitant l'utilisation directe de commandes curl complexes.

## Fonctionnalités prioritaires

Dans la première phase, nous nous concentrerons principalement sur les fonctionnalités liées aux issues GitHub :

### Issues GitHub
- **Création d'issues** : Créer de nouvelles issues avec titre, description, labels, assignés, etc.
- **Lecture d'issues** : Obtenir les détails d'une issue spécifique ou une liste d'issues avec filtrage
- **Mise à jour d'issues** : Modifier les propriétés d'une issue existante
- **Suppression d'issues** : Fermer ou supprimer une issue
- **Changement de statut** : Modifier le statut d'une issue (ouvert, fermé)
- **Listage d'issues** : Récupérer toutes les issues d'un dépôt avec options de filtrage

## Spécifications techniques

### Format
- Package npm installable globalement ou localement
- Utilisable via des commandes shell ou via npx
- Peut être importé comme bibliothèque dans d'autres projets Node.js

### Installation
```bash
# Installation globale
npm install -g ghp-connector

# Installation locale
npm install --save-dev ghp-connector

# Utilisation sans installation via npx
npx ghp-connector <commande>
```

### Configuration
- Fichier de configuration local (par exemple `.ghprc.json` ou `.ghprc.js`) pour stocker les paramètres par défaut comme le dépôt, le projet, etc.
- Configuration par environnement pour les différents contextes (développement, production)
- Les secrets (tokens d'accès GitHub, API keys) sont fournis par des variables d'environnement

### Utilisation en ligne de commande
```bash
# Exemples d'utilisation
ghp issue list
ghp issue create --title="Nouveau bug" --body="Description du bug"
ghp issue update --id=123 --status="closed"
```

### Format de sortie
- Format JSON par défaut pour l'interopérabilité
- Option de formatage lisible pour l'affichage dans le terminal
- Codes de retour standards pour faciliter l'intégration avec d'autres outils

### Authentification
- Support de l'authentification via token GitHub (Personal Access Token)
- Support des variables d'environnement pour les informations sensibles (GITHUB_TOKEN, GITHUB_API_KEY)
- Configuration stockée localement pour un usage répété

## Futurs développements

Dans les phases ultérieures, nous envisageons d'ajouter :
- Support complet pour les Projects GitHub
- Gestion des Pull Requests
- Intégration avec GitHub Actions
- Fonctionnalités avancées de filtrage et de recherche
- Support pour les webhooks GitHub

## Contribution

Ce projet est open-source et les contributions sont les bienvenues. Nous suivrons les pratiques standards pour les projets open-source, notamment :
- Utilisation d'issues pour le suivi des bugs et des fonctionnalités
- Pull requests pour les contributions
- Tests unitaires pour assurer la qualité du code
- Documentation complète de l'API 