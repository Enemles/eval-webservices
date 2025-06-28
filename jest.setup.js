// Configuration des variables d'environnement pour les tests
process.env.KEYCLOAK_URL = 'http://localhost:8080';
process.env.KEYCLOAK_REALM = 'myrealm';
process.env.KEYCLOAK_CLIENT_ID = 'myclient';
process.env.KEYCLOAK_CLIENT_SECRET = 'mysecret';

// Utilisateurs de test
process.env.KEYCLOAK_TEST_USR_USERNAME = 'test1';
process.env.KEYCLOAK_TEST_USR_PASSWORD = 'password';
process.env.KEYCLOAK_TEST_ADM_USERNAME = 'test2';
process.env.KEYCLOAK_TEST_ADM_PASSWORD = 'password';

// Admin Keycloak
process.env.KEYCLOAK_ADMIN_USERNAME = 'admin';
process.env.KEYCLOAK_ADMIN_PASSWORD = 'admin';

// URLs des APIs
process.env.API_REST_URL = 'http://localhost:3000';
process.env.API_GRAPHQL_URL = 'http://localhost:4000/graphql';
process.env.PROTO_URL = 'localhost:5000';
process.env.PROTO_PATH = '../../../libs/shared/src/proto/service.proto';

// Base de données de test
process.env.POSTGRES_HOST = 'localhost';
process.env.POSTGRES_PORT = '5432';
process.env.POSTGRES_USER = 'pguser';
process.env.POSTGRES_PASSWORD = 'pgpass';
process.env.POSTGRES_DB = 'pgdb';

// Mode test
process.env.NODE_ENV = 'test';
process.env.TEST_MODE = 'true'; 