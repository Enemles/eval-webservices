const KcAdminClient = require('keycloak-admin').default;

(async () => {
    const kcAdminClient = new KcAdminClient();

    // Variables that might change
    const KEYCLOAK_URL = process.env.KEYCLOAK_URL || 'http://localhost:8080';
    const ADMIN_USERNAME = process.env.KEYCLOAK_ADMIN_USERNAME || 'admin';
    const ADMIN_PASSWORD = process.env.KEYCLOAK_ADMIN_PASSWORD || 'admin';
    const REALM_NAME = process.env.KEYCLOAK_REALM || 'myrealm';
    const CLIENT_ID = process.env.KEYCLOAK_CLIENT_ID || 'myclient';
    const CLIENT_SECRET = process.env.KEYCLOAK_CLIENT_SECRET || 'mysecret';
    const REDIRECT_URI = 'http://localhost:3000/callback';
    const LOGOUT_REDIRECT_URI = 'http://localhost:3000/';

    const users = [
        {
            username: 'test1',
            email: process.env.KEYCLOAK_TEST_USR_USERNAME || 'testuser1@example.com',
            firstName: 'Test',
            lastName: 'User',
            password: process.env.KEYCLOAK_TEST_USR_PASSWORD || 'password',
        },
        {
            username: 'test2',
            email: process.env.KEYCLOAK_TEST_ADM_USERNAME || 'testuser2@example.com',
            firstName: 'Test',
            lastName: 'User',
            password: process.env.KEYCLOAK_TEST_ADM_PASSWORD || 'password',
        }
        ];

    // Configure the client
    kcAdminClient.setConfig({
        baseUrl: KEYCLOAK_URL,
        realmName: 'master',
    });

    // Authenticate with admin credentials
    await kcAdminClient.auth({
        username: ADMIN_USERNAME,
        password: ADMIN_PASSWORD,
        grantType: 'password',
        clientId: 'admin-cli',
    });

    // Create the realm if it doesn't exist
    try {
        const existingRealms = await kcAdminClient.realms.find();
        const realmExists = existingRealms.some(realm => realm.realm === REALM_NAME);
        
        if (!realmExists) {
            await kcAdminClient.realms.create({
                realm: REALM_NAME,
                enabled: true,
            });
            console.log(`Realm ${REALM_NAME} created.`);
        } else {
            console.log(`Realm ${REALM_NAME} already exists.`);
        }
    } catch (err) {
        console.error('Error creating realm:', err.response?.data || err);
    }

    // Set the realm
    kcAdminClient.setConfig({
        realmName: REALM_NAME,
    });

    // Create the client if it doesn't exist
    try {
        const existingClients = await kcAdminClient.clients.find({ clientId: CLIENT_ID });
        
        if (existingClients.length === 0) {
            const client = await kcAdminClient.clients.create({
                clientId: CLIENT_ID,
                secret: CLIENT_SECRET,
                redirectUris: [REDIRECT_URI, LOGOUT_REDIRECT_URI],
                standardFlowEnabled: true,
                directAccessGrantsEnabled: true,
                publicClient: false,
                serviceAccountsEnabled: true,
            });
            console.log(`Client ${CLIENT_ID} created.`);
        } else {
            console.log(`Client ${CLIENT_ID} already exists.`);
        }
    } catch (err) {
        console.error('Error creating client:', err.response?.data || err);
    }

    // Create roles if they don't exist
    const rolesToCreate = ['user', 'admin'];
    for (const roleName of rolesToCreate) {
        try {
            const existingRole = await kcAdminClient.roles.findOneByName({ name: roleName });
            
            if (!existingRole) {
                await kcAdminClient.roles.create({
                    name: roleName,
                });
                console.log(`Role ${roleName} created.`);
            } else {
                console.log(`Role ${roleName} already exists.`);
            }
        } catch (err) {
            console.error(`Error creating role ${roleName}:`, err.response?.data || err);
        }
    }

    const usersCreated = [];
    
    // Create users if they don't exist
    for (const user of users) {
        try {
            const existingUsers = await kcAdminClient.users.find({ username: user.username });
            
            if (existingUsers.length === 0) {
                const u = await kcAdminClient.users.create({
                    username: user.username,
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    credentials: [
                        {
                            type: 'password',
                            value: user.password,
                            temporary: false,
                        },
                    ],
                    enabled: true,
                });
                console.log(`User ${user.username} created.`);
                console.log(u);
                usersCreated.push({...u, ...user});
            } else {
                console.log(`User ${user.username} already exists.`);
                usersCreated.push({...existingUsers[0], ...user});
            }
        } catch (err) {
            console.error(`Error creating user ${user.username}:`, err.response?.data || err);
        }
    }

    // Get the roles
    const roleUser = await kcAdminClient.roles.findOneByName({ name: 'user' });
    const roleAdmin = await kcAdminClient.roles.findOneByName({ name: 'admin' });

    // Assign role to user (check if not already assigned)
    try {
        const userRoles = await kcAdminClient.users.listRealmRoleMappings({ id: usersCreated[0].id });
        const hasUserRole = userRoles.some(role => role.name === 'user');
        
        if (!hasUserRole) {
            await kcAdminClient.users.addRealmRoleMappings({
                id: usersCreated[0].id,
                roles: [
                    {
                        id: roleUser.id,
                        name: roleUser.name,
                    },
                ],
            });
            console.log(`Role ${roleUser.name} assigned to user ${usersCreated[0].email}.`);
        } else {
            console.log(`Role ${roleUser.name} already assigned to user ${usersCreated[0].email}.`);
        }
    } catch (err) {
        console.error('Error assigning user role:', err.response?.data || err);
    }

    // Assign admin role to user2 (check if not already assigned)
    try {
        const userRoles = await kcAdminClient.users.listRealmRoleMappings({ id: usersCreated[1].id });
        const hasAdminRole = userRoles.some(role => role.name === 'admin');
        
        if (!hasAdminRole) {
            await kcAdminClient.users.addRealmRoleMappings({
                id: usersCreated[1].id,
                roles: [
                    {
                        id: roleAdmin.id,
                        name: roleAdmin.name,
                    },
                ],
            });
            console.log(`Role ${roleAdmin.name} assigned to user ${usersCreated[1].email}.`);
        } else {
            console.log(`Role ${roleAdmin.name} already assigned to user ${usersCreated[1].email}.`);
        }
    } catch (err) {
        console.error('Error assigning admin role:', err.response?.data || err);
    }

    // Give "test2" the right to create users in this realm
    try {
        const realmManagementClients = await kcAdminClient.clients.find({
            clientId: 'realm-management',
        });
        
        if (!realmManagementClients.length) {
            console.error(`Le client "realm-management" est introuvable dans le realm "${REALM_NAME}".`);
            process.exit(1);
        }

        const realmManagementClient = realmManagementClients[0];
        
        // Get the "manage-users" role from "realm-management" client
        const manageUsersRole = await kcAdminClient.clients.findRole({
            id: realmManagementClient.id,
            roleName: 'manage-users',
        });
        
        if (!manageUsersRole) {
            console.error(`Le rôle "manage-users" n'existe pas pour "realm-management" dans le realm "${REALM_NAME}".`);
            process.exit(1);
        }

        // Check if the role is already assigned
        const clientRoles = await kcAdminClient.users.listClientRoleMappings({
            id: usersCreated[1].id,
            clientUniqueId: realmManagementClient.id,
        });
        
        const hasManageUsersRole = clientRoles.some(role => role.name === 'manage-users');
        
        if (!hasManageUsersRole) {
            // Assign this role to test2
            await kcAdminClient.users.addClientRoleMappings({
                id: usersCreated[1].id, // test2
                clientUniqueId: realmManagementClient.id,
                roles: [
                    { id: manageUsersRole.id, name: manageUsersRole.name },
                ],
            });
            console.log(`Rôle "manage-users" (client "realm-management") assigné à ${usersCreated[1].username}.`);
        } else {
            console.log(`Rôle "manage-users" déjà assigné à ${usersCreated[1].username}.`);
        }
    } catch (err) {
        console.error('Error assigning manage-users role:', err.response?.data || err);
    }

})();
