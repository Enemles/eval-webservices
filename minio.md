# MinIO

---

## 1. Contexte et fonctionnalité cible

Nous souhaitons ajouter une route **/api/users/:id/extract** (dans l’API REST) qui permet de :
1. Appeler le service gRPC pour générer un fichier CSV récapitulatif de toutes les réservations d’un utilisateur.
2. Stocker ce fichier CSV dans MinIO.
3. Obtenir une URL (ex. presignée) permettant de télécharger le fichier.
4. Renvoyer cette URL dans la réponse HTTP pour permettre à l’utilisateur de télécharger le CSV.

Exemple de csv : 
```
reservation_id,user_id,room_id,start_time,end_time,status
1,10,5,2025-06-01T10:00:00Z,2025-06-01T12:00:00Z,approved
2,10,2,2025-07-01T09:00:00Z,2025-07-01T11:00:00Z,pending
...

```

### 1.1 Route rest 
<pre>
GET /api/users/:id/extract
Réponse 200 :
{
    "url": "https://minio.example.com/reservations-csv/user_10_1678812345.csv"
}
</pre>

### 1.2 Service gRPC
```proto
service Extracts {
    rpc GenerateUserExtract (GenerateUserExtractRequest) returns (GenerateUserExtractResponse) {}
}

message GenerateUserExtractRequest {
    int32 user_id = 1;
}

message GenerateUserExtractResponse {
    string url = 1;
}
```
---

## 2. Présentation de MinIO

[MinIO](https://min.io/) est un système de stockage d’objets compatible S3. Il peut être hébergé localement ou dans un cluster. Les principales opérations sont :
- Création d’un “bucket” pour y stocker des objets (ici, des fichiers CSV).
- Téléversement d’objets (PUT).
- Récupération de liens publics ou presignés pour partager les objets.

MinIO peut fonctionner sous Docker, très similaire à la configuration suivante :

```bash
docker run -p 9000:9000 -p 9001:9001 \
  -e MINIO_ROOT_USER=minioadmin \
  -e MINIO_ROOT_PASSWORD=minioadmin \
  quay.io/minio/minio server /data --console-address ":9001"
```

```typescript
// Obtenir un lien présigné
const presignedUrl = s3Client.getSignedUrl('getObject', {
    Bucket: 'reservations-csv',
    Key: 'extracts/user_10_1678812345.csv',
    Expires: 60 * 5 // 5 minutes
});

```