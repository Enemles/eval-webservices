# 🚀 Guide de Démarrage Rapide - Plateforme de Réservation

Ce guide permet de lancer et tester l'ensemble de la plateforme en quelques commandes simples.

## 📋 Prérequis

- Docker & Docker Compose
- Node.js (pour les tests locaux)

## ⚡ Démarrage Rapide

### 1. Cloner et démarrer la plateforme

```bash
# Cloner le repository
git clone <votre-repo>
cd eval

# Lancer tous les services
docker-compose up --build
```

### 2. Attendre l'initialisation complète

Les services se lancent automatiquement dans l'ordre suivant :
1. **PostgreSQL** (base de données)
2. **Keycloak** (authentification) 
3. **MinIO** (stockage d'objets)
4. **Initialisation Keycloak** (realm, clients, utilisateurs)
5. **Services applicatifs** (REST, GraphQL, gRPC)

⏳ **Temps d'attente** : ~2-3 minutes pour le premier démarrage

### 3. Vérifier que tout fonctionne

Les services sont accessibles sur :

| Service | URL | Description |
|---------|-----|-------------|
| **API REST** | http://localhost:3000/docs | Documentation Swagger |
| **API GraphQL** | http://localhost:4000/graphql | Playground GraphQL |
| **Service gRPC** | localhost:50051 | Service gRPC |
| **Keycloak** | http://localhost:8080 | Console admin (admin/admin) |
| **MinIO Console** | http://localhost:9090 | Console MinIO (minioadmin/minioadmin) |

## 🧪 Lancer les Tests E2E

### Option 1 : Script automatique (recommandé)

```bash
# Installe les dépendances et lance les tests
npm install
npm run test:docker
```

Ce script :
- ✅ Vérifie que tous les services sont prêts
- ✅ Attend l'initialisation complète
- ✅ Lance tous les tests E2E
- ✅ Affiche un rapport coloré

### Option 2 : Tests manuels

```bash
# Lancer tous les tests
npm test src/tests

# Lancer des tests spécifiques
npm test src/tests/api-rest/users.e2e.test.js
npm test src/tests/api-graphql/room.e2e.test.js
npm test src/tests/api-grpc/notification.e2e.test.js
```

## 🏗️ Architecture

```
┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
│   API REST      │  │   API GraphQL   │  │  Service gRPC   │
│   (Port 3000)   │  │   (Port 4000)   │  │  (Port 50051)   │
└─────────┬───────┘  └─────────┬───────┘  └─────────┬───────┘
          │                    │                    │
          └────────────────────┼────────────────────┘
                               │
         ┌─────────────────────┴─────────────────────┐
         │              PostgreSQL                  │
         │              (Port 5432)                 │
         └─────────────────────┬─────────────────────┘
                               │
    ┌─────────────┬───────────────────┬─────────────────┐
    │  Keycloak   │      MinIO        │   App Network   │
    │ (Port 8080) │  (Ports 9000/90)  │    (Bridge)     │
    └─────────────┴───────────────────┴─────────────────┘
```

## 🔑 Comptes de Test

### Keycloak (Realm: myrealm)
- **Utilisateur** : test1 / password
- **Admin** : test2 / password  
- **Keycloak Admin** : admin / admin

### Base de Données
- **Host** : localhost:5432
- **User** : pguser / pgpass
- **Database** : pgdb

## 🛠️ Résolution de Problèmes

### Les tests échouent
```bash
# Vérifier que les services sont démarrés
docker-compose ps

# Redémarrer les services
docker-compose down
docker-compose up --build
```

### Problème de ports
```bash
# Vérifier les ports utilisés
lsof -i :3000 -i :4000 -i :5000 -i :8080 -i :9000

# Libérer les ports si nécessaire
docker-compose down
```

### Réinitialiser complètement
```bash
# Supprimer tous les conteneurs et volumes
docker-compose down -v
docker system prune -f

# Relancer
docker-compose up --build
```

## ✅ Validation Fonctionnelle

Tous les éléments requis sont présents :

- ✅ **API REST** avec Swagger documenté
- ✅ **API GraphQL** avec authentification Keycloak  
- ✅ **Service gRPC** pour notifications et exports
- ✅ **PostgreSQL** pour la persistance
- ✅ **Keycloak** pour l'authentification JWT
- ✅ **MinIO** pour le stockage de fichiers
- ✅ **Docker Compose** pour orchestrer tous les services
- ✅ **Tests E2E** complets et automatisés
- ✅ **Dockerfiles** pour chaque service
- ✅ **Initialisation automatique** de l'environnement

🎉 **La plateforme est prête à être évaluée !** 