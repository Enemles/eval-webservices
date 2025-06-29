// tests/setupKeycloak.js
const request = require('supertest');
const jwksClient = require('jwks-rsa');
const jwt = require('jsonwebtoken');

let keycloakUsrAccessToken = '';
let keycloakAdmAccessToken = '';
let keycloakAdminToken = '';

// Configuration hardcodée basée sur notre setup Docker
const KEYCLOAK_CONFIG = {
  URL: process.env.KEYCLOAK_URL || 'http://localhost:8080',
  REALM: process.env.KEYCLOAK_REALM || 'myrealm',
  CLIENT_ID: process.env.KEYCLOAK_CLIENT_ID || 'myclient',
  CLIENT_SECRET: process.env.KEYCLOAK_CLIENT_SECRET || 'mysecret',
  TEST_USR_USERNAME: process.env.KEYCLOAK_TEST_USR_USERNAME || 'user',
  TEST_USR_PASSWORD: process.env.KEYCLOAK_TEST_USR_PASSWORD || 'password',
  TEST_ADM_USERNAME: process.env.KEYCLOAK_TEST_ADM_USERNAME || 'admin',
  TEST_ADM_PASSWORD: process.env.KEYCLOAK_TEST_ADM_PASSWORD || 'admin',
  ADMIN_USERNAME: process.env.KEYCLOAK_ADMIN_USERNAME || 'admin',
  ADMIN_PASSWORD: process.env.KEYCLOAK_ADMIN_PASSWORD || 'admin'
};

/**
 * Récupère un token Keycloak via le flow "Resource Owner Password Credentials"
 * et le stocke dans keycloakUsrAccessToken.
 */
async function getKeycloakUsrToken() {
  const res = await request(KEYCLOAK_CONFIG.URL)
    .post(`/realms/${KEYCLOAK_CONFIG.REALM}/protocol/openid-connect/token`)
    .type('form')
    .send({
      grant_type: 'password',
      client_id: KEYCLOAK_CONFIG.CLIENT_ID,
      client_secret: KEYCLOAK_CONFIG.CLIENT_SECRET, // si le client est en mode "confidential"
      username: KEYCLOAK_CONFIG.TEST_USR_USERNAME,
      password: KEYCLOAK_CONFIG.TEST_USR_PASSWORD,
    });

  if (res.status !== 200) {
    throw new Error(`Impossible de récupérer le token Keycloak user: ${res.text}`);
  }

  keycloakUsrAccessToken = res.body.access_token;
}

/**
 * Récupère un token Keycloak via le flow "Resource Owner Password Credentials"
 * et le stocke dans keycloakAdmAccessToken.
 */
async function getKeycloakAdmToken() {
  const res = await request(KEYCLOAK_CONFIG.URL)
    .post(`/realms/${KEYCLOAK_CONFIG.REALM}/protocol/openid-connect/token`)
    .type('form')
    .send({
      grant_type: 'password',
      client_id: KEYCLOAK_CONFIG.CLIENT_ID,
      client_secret: KEYCLOAK_CONFIG.CLIENT_SECRET, // si le client est en mode "confidential"
      username: KEYCLOAK_CONFIG.TEST_ADM_USERNAME,
      password: KEYCLOAK_CONFIG.TEST_ADM_PASSWORD,
    });

  if (res.status !== 200) {
    throw new Error(`Impossible de récupérer le token Keycloak admin: ${res.text}`);
  }

  keycloakAdmAccessToken = res.body.access_token;
}

/**
 * Récupère un token admin Keycloak pour effectuer des actions d'administration
 * et le stocke dans keycloakAdminToken.
 */
async function getKeycloakAdminToken() {
  try {
    const res = await request(KEYCLOAK_CONFIG.URL)
      .post(`/realms/master/protocol/openid-connect/token`)
      .type('form')
      .send({
        grant_type: 'password',
        client_id: 'admin-cli',
        username: KEYCLOAK_CONFIG.ADMIN_USERNAME,
        password: KEYCLOAK_CONFIG.ADMIN_PASSWORD,
      });

    if (res.status !== 200) {
      throw new Error(`Impossible de récupérer le token Keycloak master admin: ${res.text}`);
    }

    keycloakAdminToken = res.body.access_token;
  } catch (err) {
    console.error('Error fetching admin token:', err);
    throw err;
  }
}

// Getter pour récupérer le token dans d'autres fichiers de test
function getUsrToken() {
  return keycloakUsrAccessToken;
}
// Getter pour récupérer le token dans d'autres fichiers de test
function getAdmToken() {
  return keycloakAdmAccessToken;
}

function getAdminToken() {
  return keycloakAdminToken;
}

/**
 * Vérifie le token JWT généré via le JWKS de Keycloak.
 *
 * @param {string} token - Le token JWT que l'on souhaite vérifier.
 * @returns {Promise<Object>} - Retourne le payload décodé du token si la vérification réussit, sinon lève une erreur.
 */
async function verifyJwtToken(token) {
  // Initialise un client JWKS pointant vers les clés publiques du realm Keycloak
  const client = jwksClient({
    jwksUri: `${KEYCLOAK_CONFIG.URL}/realms/${KEYCLOAK_CONFIG.REALM}/protocol/openid-connect/certs`,
  });

  // Cette fonction permet à `jsonwebtoken` de récupérer la clé correspondant au kid du token
  function getKey(header, callback) {
    client.getSigningKey(header.kid, (err, key) => {
      if (err) {
        return callback(err);
      }
      // Récupère la clé publique et renvoie au callback
      const signingKey = key.getPublicKey();
      callback(null, signingKey);
    });
  }

  // On retourne une Promise pour pouvoir faire un `await` dessus
  return new Promise((resolve, reject) => {
    jwt.verify(
      token,
      getKey,
      {
        // Vérifie que l'issuer correspond à ton realm Keycloak
        issuer: `${KEYCLOAK_CONFIG.URL}/realms/${KEYCLOAK_CONFIG.REALM}`,
      },
      (err, decoded) => {
        if (err) {
          return reject(err);
        }
        return resolve(decoded);
      },
    );
  });
}

// Hook Jest appelé avant tous les tests
beforeAll(async () => {
  console.log('🔄 Initialisation des tokens Keycloak...');
  await getKeycloakUsrToken();
  console.log('✅ Token utilisateur obtenu');
  await getKeycloakAdminToken();
  console.log('✅ Token admin master obtenu');
  await getKeycloakAdmToken();
  console.log('✅ Token admin realm obtenu');
}, 30000); // Timeout plus large si nécessaire

module.exports = {
  getUsrToken,
  getAdmToken,
  getAdminToken,
  verifyJwtToken,
};
