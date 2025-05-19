# Spécifications Techniques

## Contexte et objectifs

- Plateforme de réservation de salles : Permettre à des utilisateurs de réserver une ou plusieurs salles pour des créneaux horaires spécifiques (réunions, coworking, etc.).
3 applications distinctes :
- API REST (exposée en HTTP, documentée avec Swagger/OpenAPI).
- API GraphQL (permettant des requêtes/mutations ciblées sur les données).
- Service gRPC (responsable des notifications, qui pour la démo seront simplement stockées en base).
- Sécurisation : Les accès à l'API REST et à l'API GraphQL doivent être protégés par JWT via un Keycloak central.
- Base de données : PostgreSQL, exécutée dans un conteneur Docker.

## Architecture générale
(voir le schéma ci-dessous)
![Architecture générale](img_1.png)

## Documentations

- [API REST](api_rest.md)
- [API GraphQL](api_graphql.md)
- [API gRPC](api_grpc.md)
- [Base de données](database.md)
- [Keycloak](keycloak.md)
- [MinIO](minio.md)

## Docker compose

Un docker compose est fourni pour démarrer l'ensemble des services nécessaires pour le projet. Il est possible de démarrer l'ensemble des services avec la commande suivante :
Tous les identifiants et mots de passe sont configurés dans le `docker-compose.yml` pour faciliter la mise en place du projet.
- [docker-compose.yml](docker-compose.yml)
```bash
docker compose up
```

# Tests du Projet

## Prérequis

Les tests de ce projet nécessitent un environnement complet incluant :

- Une instance de Keycloak en cours d'exécution (pour l'authentification)
- Une base de données PostgreSQL configurée
- Les API REST, GraphQL et gRPC en cours d'exécution

## Configuration

1. Assurez-vous que les variables d'environnement sont définies dans un fichier `.env` à la racine du projet :

```
# Configuration API
API_REST_URL=http://localhost:3000
API_GRAPHQL_URL=http://localhost:4000
API_GRPC_URL=localhost:5000

# Configuration Keycloak
KEYCLOAK_URL=http://localhost:8080
KEYCLOAK_REALM=myrealm
KEYCLOAK_CLIENT_ID=myclient
KEYCLOAK_ADMIN_CLIENT_ID=admin-cli
KEYCLOAK_CLIENT_SECRET=mysecret
KEYCLOAK_ADMIN_USERNAME=admin
KEYCLOAK_ADMIN_PASSWORD=admin
KEYCLOAK_TEST_USERNAME=testuser1@example.com
KEYCLOAK_TEST_PASSWORD=password

# Configuration base de données
DB_HOST=localhost
DB_PORT=5432
DB_NAME=pgdb
DB_USER=pguser
DB_PASS=pgpass

# MinIO configuration
MINIO_ENDPOINT=localhost
MINIO_PORT=9000
MINIO_ROOT_USER=minioadmin
MINIO_ROOT_PASSWORD=minioadmin
```

2. Lancez docker-compose pour démarrer tous les services nécessaires (Keycloak, PostgreSQL, MinIO) :

```bash
docker-compose up -d
```

3. Démarrez les API :

```bash
# Pour l'API REST
npm run start:dev --prefix apps/rest

# Pour l'API GraphQL
npm run start:dev --prefix apps/graphql-api

# Pour l'API gRPC
npm run start:dev --prefix apps/grpc
```

## Exécution des tests

Pour exécuter tous les tests :

```bash
npm test
```

Pour exécuter un test spécifique :

```bash
# Tests REST API
npm test -- src/tests/api-rest/users.e2e.test.js
npm test -- src/tests/api-rest/rooms.e2e.test.js
npm test -- src/tests/api-rest/reservation.e2e.test.js

# Tests GraphQL API (si disponibles)
npm test -- src/tests/api-graphql

# Tests gRPC API (si disponibles)
npm test -- src/tests/api-grpc
```

## Notes importantes

- Les tests sont configurés pour utiliser les fichiers de setup et de nettoyage situés dans `src/tests/setup.js` et `src/tests/cleanup.js`.
- Le script `setup.js` s'occupe de la récupération des tokens Keycloak.
- Le script `cleanup.js` nettoie la base de données et synchronise les utilisateurs Keycloak.