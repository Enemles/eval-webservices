const axios = require("axios");
const {AxiosError} = require("axios");

const BASE_URL = process.env.API_GRAPHQL_URL || 'http://localhost:4000/graphql';

/**
 * Fonction utilitaire pour envoyer des requêtes GraphQL.
 * @param {string} query - La requête ou mutation GraphQL.
 * @param {object} variables - Les variables associées à la requête/mutation.
 * @param {string} token - Le token Keycloak.
 * @returns {Promise<any>} - Retourne la partie "data" de la réponse GraphQL.
 */
const graphqlQuery = async (query, variables, token) => {
  try {
    console.log('GraphQL Request:', { query: query.substring(0, 100) + '...', variables, url: BASE_URL });
    const response = await axios.post(
      BASE_URL,
      {query, variables},
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.data.errors) {
      console.log('GraphQL Errors:', response.data.errors);
      throw new Error(`GraphQL Error: ${JSON.stringify(response.data.errors)}`);
    }
    return response.data.data;
  } catch (error) {
    if (error.response) {
      console.log('HTTP Status:', error.response.status);
      console.log('Response Data:', error.response.data);
      throw new Error(`HTTP ${error.response.status}: ${JSON.stringify(error.response.data)}`);
    }
    throw error;
  }
}

module.exports = {
  graphqlRequest: graphqlQuery
}