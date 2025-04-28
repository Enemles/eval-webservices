# Api Rest

## Routes

> **Note :** Toutes les routes décrites ci-dessous sont protégées par JWT (Keycloak).  
> Pour chaque requête, le client doit inclure dans l’en-tête HTTP :  
> `Authorization: Bearer <token>`

---

### Gestion des Salles (Rooms)

#### 1. GET /api/rooms
<pre>
Query parameters (optionnels) :
- skip: number
- limit: number

Réponse :
{
  "rooms": [
    {
      "id": number,
      "name": string,
      "capacity": number,
      "location": string,
      "created_at": string
    },
    ...
  ]
}
</pre>
Renvoie la liste paginée des salles.

#### 2. GET /api/rooms/{id}
<pre>
Path parameter :
- id : identifiant numérique de la salle

Réponse :
{
  "id": number,
  "name": string,
  "capacity": number,
  "location": string,
  "created_at": string
}
</pre>
Renvoie les détails d’une salle spécifique.

#### 3. POST /api/rooms
<pre>
Body (JSON) :
{
  "name": string,       // Obligatoire
  "capacity": number,   // Obligatoire
  "location": string    // Optionnel mais recommandé
}

Réponse (201 Created) :
{
  "id": number,
  "name": string,
  "capacity": number,
  "location": string,
  "created_at": string
}
</pre>
Crée une nouvelle salle et renvoie l’objet créé.

#### 4. PUT /api/rooms/{id}
<pre>
Path parameter :
- id : identifiant numérique de la salle à modifier

Body (JSON) :
{
  "name": string,       // Peut être inchangé ou mis à jour
  "capacity": number,
  "location": string
}

Réponse :
{
  "id": number,
  "name": string,
  "capacity": number,
  "location": string,
  "created_at": string
}
</pre>
Met à jour les informations d’une salle existante.

#### 5. DELETE /api/rooms/{id}
<pre>
Path parameter :
- id : identifiant numérique de la salle

Réponse (204 No Content) :
Aucun corps de réponse.
</pre>
Supprime une salle spécifique.

---

### Gestion des Réservations (Reservations)

#### 1. GET /api/reservations
<pre>
Query parameters (optionnels) :
- skip: number
- limit: number

Réponse :
{
  "reservations": [
    {
      "id": number,
      "user_id": number,
      "room_id": number,
      "start_time": string,
      "end_time": string,
      "created_at": string
    },
    ...
  ]
}
</pre>
Renvoie la liste paginée des réservations.

#### 2. GET /api/reservations/{id}
<pre>
Path parameter :
- id : identifiant numérique de la réservation

Réponse :
{
  "id": number,
  "user_id": number,
  "room_id": number,
  "start_time": string,
  "end_time": string,
  "created_at": string
}
</pre>
Renvoie les détails d’une réservation spécifique.

#### 3. POST /api/reservations
<pre>
Body (JSON) :
{
  "user_id": number,    // Identifiant de l'utilisateur
  "room_id": number,    // Identifiant de la salle
  "start_time": string, // Format ISO8601 : "YYYY-MM-DDTHH:mm:ss"
  "end_time": string    // Idem
}

Réponse (201 Created) :
{
  "id": number,
  "user_id": number,
  "room_id": number,
  "start_time": string,
  "end_time": string,
  "created_at": string
}
</pre>
Crée une nouvelle réservation et renvoie l’objet créé.

#### 4. PUT /api/reservations/{id}
<pre>
Path parameter :
- id : identifiant numérique de la réservation à modifier

Body (JSON) :
{
  "user_id": number,    // Peut être inchangé ou mis à jour
  "room_id": number,
  "start_time": string,
  "end_time": string
}

Réponse :
{
  "id": number,
  "user_id": number,
  "room_id": number,
  "start_time": string,
  "end_time": string,
  "created_at": string
}
</pre>
Met à jour les informations d’une réservation existante.

#### 5. DELETE /api/reservations/{id}
<pre>
Path parameter :
- id : identifiant numérique de la réservation

Réponse (204 No Content) :
Aucun corps de réponse.
</pre>
Supprime une réservation spécifique.

---

### Gestion des Utilisateurs (Users)

#### 0. Post /api/login
<pre>
Body (JSON) :
{
  "email": string,
  "password": string
}

Réponse :
{
    "accessToken": string
    }
</pre>

#### 1. GET /api/users
<pre>
Query parameters (optionnels) :
- skip: number
- limit: number

Réponse :
{
  "users": [
    {
      "id": number,
      "keycloak_id": string,
      "created_at": string,
      "email": string
    },
    ...
  ]
}
</pre>
Renvoie la liste paginée des utilisateurs (tels qu’ils sont enregistrés dans la base locale pour la partie réservation).

#### 2. GET /api/users/{id}
<pre>
Path parameter :
- id : identifiant numérique de l'utilisateur

Réponse :
{
  "id": number,
  "keycloak_id": string,
  "created_at": string,
  "email": string
}
</pre>
Renvoie les détails d’un utilisateur spécifique.

---

## Documentation Swagger

Pour documenter ces routes, chaque endpoint doit être décrit dans votre configuration Swagger (OpenAPI).  
Les champs requis, les types de données, et les codes de statut (200, 201, 204, 400, 404, etc.) doivent y être précisés.  
