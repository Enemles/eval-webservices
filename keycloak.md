# Keycloak

Ce document décrit la configuration et l’utilisation de Keycloak dans le cadre du projet de plateforme de réservation de salles. L’objectif est de mettre en place une gestion des identités et des accès (IAM) centralisée, afin de sécuriser l’API REST et l’API GraphQL via JWT.

---

## 1. Présentation de Keycloak

[Keycloak](https://www.keycloak.org/) est un outil Open Source d’Identity and Access Management (IAM) qui fournit :
- Gestion des utilisateurs (création, suppression, rôles, groupes).
- Authentification et autorisation via des protocoles standards (OpenID Connect, OAuth2, SAML).
- Support des tokens JWT pour les applications Web, mobiles, et services.

Dans ce projet, Keycloak va être le point d’entrée pour valider les identifiants des utilisateurs et délivrer un JWT, qui sera ensuite transmis dans l’en-tête `Authorization: Bearer <token>` lors des appels à l’API REST et GraphQL.

---

## 2. Configuration
 <pre>
npm i 
node init-keycloak.js
 // cela va configurer votre keycloak avec les éléments suivant : 
    // - un realm : myrealm
    // - un client : myclient
    // - 2 roles : user et admin
    // - un utilisateur : testuser1@example.com (mot de passe : password) avec le role user
    // - un utilisateur : testuser2@example.com (mot de passe : password) avec le role admin

</pre>

## 3. Utilisation
Pour les API REST et GraphQL, le token doit être extrait de l’en-tête `Authorization` et validé par Keycloak.
Vous devrez utilisez les API OpenID Connect de Keycloak pour valider le token à chaque requête.
do

