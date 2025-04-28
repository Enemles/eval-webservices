# API GraphQL


> **Note :** Tout accès à cette API doit être protégé par JWT (Keycloak).  
> Le serveur GraphQL peut, par exemple, intercepter le token dans l’en-tête `Authorization` avant d’autoriser l’exécution des requêtes.

---

## 1. Schéma GraphQL 

```graphql
# ------------------------------
# Types de base
# ------------------------------

type Room {
  id: ID!
  name: String!
  capacity: Int!
  location: String
  created_at: DateTime!
}

type Reservation {
  id: ID!
  user_id: Int!
  room_id: Int!
  start_time: DateTime!
  end_time: DateTime!
  created_at: DateTime!
}

type User {
  id: ID!
  keycloak_id: String!
  created_at: DateTime!
  email: String
}

# ------------------------------
# Queries
# ------------------------------

type Query {
  # -- Rooms --
  listRooms(skip: Int, limit: Int): [Room!]!
  room(id: ID!): Room

  # -- Reservations --
  listReservations(skip: Int, limit: Int): [Reservation!]!
  reservation(id: ID!): Reservation

  # -- Users --
  listUsers(skip: Int, limit: Int): [User!]!
  user(id: ID!): User
}

# ------------------------------
# Mutations
# ------------------------------

type Mutation {
  # -- Users --
  login(email: String!, password: String!): {accessToken:String}
  # -- Rooms --
  createRoom(name: String!, capacity: Int!, location: String): Room!
  updateRoom(id: ID!, name: String, capacity: Int, location: String): Room!
  deleteRoom(id: ID!): Boolean!

  # -- Reservations --
  createReservation(
    user_id: Int!,
    room_id: Int!,
    start_time: DateTime!,
    end_time: DateTime!
  ): Reservation!

  updateReservation(
    id: ID!,
    user_id: Int,
    room_id: Int,
    start_time: DateTime,
    end_time: DateTime
  ): Reservation!

  deleteReservation(id: ID!): Boolean!
}

# ------------------------------
# Schema Root
# ------------------------------

schema {
  query: Query
  mutation: Mutation
}
```