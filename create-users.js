// create-users.js
require('dotenv').config();
const { Pool } = require('pg');

// Configuration Postgres
const pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'pgdb',
    user: process.env.DB_USER || 'pguser',
    password: process.env.DB_PASS || 'pgpass',
    port: Number(process.env.DB_PORT) || 5432,
});

async function createUsers() {
    try {
        // Créer quelques utilisateurs de test
        const users = [
            {
                keycloak_id: 'test1',
                email: 'test1@example.com'
            },
            {
                keycloak_id: 'test2',
                email: 'test2@example.com'
            },
            {
                keycloak_id: 'test3',
                email: 'test3@example.com'
            }
        ];

        for (const user of users) {
            // Insertion dans la table users avec les champs updated_at et created_at
            await pool.query(
                `INSERT INTO "users" ("keycloak_id", "email", "created_at", "updated_at")
                 VALUES ($1, $2, NOW(), NOW())
                 ON CONFLICT ("keycloak_id") DO NOTHING`,
                [user.keycloak_id, user.email]
            );
            console.log(`Utilisateur ${user.email} créé ou déjà existant.`);
        }

        console.log('Création des utilisateurs terminée.');
    } catch (err) {
        console.error('Erreur lors de la création des utilisateurs:', err);
    } finally {
        await pool.end();
    }
}

createUsers(); 