# Dockerfile pour l'API REST
FROM node:20-alpine

# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers de dépendances
COPY package*.json ./
COPY nest-cli.json ./
COPY tsconfig.json ./
COPY tsconfig.build.json ./

# Installer toutes les dépendances (dev incluses pour la compilation)
RUN npm ci --legacy-peer-deps

# Copier le code source
COPY . .

# Construire l'application REST
RUN npm run build rest

# Exposer le port
EXPOSE 3000

# Variables d'environnement par défaut
ENV NODE_ENV=production

# Démarrer l'application
CMD ["node", "dist/apps/rest/main"] 