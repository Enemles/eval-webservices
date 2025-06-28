#!/bin/bash

echo "🚀 Lancement des tests E2E de la plateforme de réservation"
echo "=================================================="

# Couleurs pour les messages
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Fonction pour attendre qu'un service soit prêt
wait_for_service() {
    local service=$1
    local url=$2
    local max_attempts=30
    local attempt=1
    
    echo -e "${YELLOW}⏳ Attente que $service soit prêt...${NC}"
    
    while [ $attempt -le $max_attempts ]; do
        local http_code=$(curl -s -o /dev/null -w "%{http_code}" "$url" 2>/dev/null)
        # Codes acceptés : 200, 401 (GraphQL protected), 302 (Keycloak redirect)
        if [[ "$http_code" == "200" || "$http_code" == "401" || "$http_code" == "302" ]]; then
            echo -e "${GREEN}✅ $service est prêt ! (HTTP $http_code)${NC}"
            return 0
        fi
        echo "   Tentative $attempt/$max_attempts... (HTTP $http_code)"
        sleep 2
        ((attempt++))
    done
    
    echo -e "${RED}❌ $service n'est pas accessible après $max_attempts tentatives${NC}"
    return 1
}

# Vérifier que Docker Compose est démarré
echo -e "${YELLOW}🔍 Vérification des services Docker...${NC}"

# Attendre que tous les services soient prêts
wait_for_service "API REST" "http://localhost:3000/docs" || exit 1
wait_for_service "API GraphQL" "http://localhost:4000" || exit 1  
wait_for_service "Keycloak" "http://localhost:8080" || exit 1
wait_for_service "MinIO Console" "http://localhost:9090/minio/health/live" || exit 1

# Vérifier que gRPC est accessible (simple test de port)
echo -e "${YELLOW}⏳ Vérification du service gRPC...${NC}"
if nc -z localhost 50051; then
    echo -e "${GREEN}✅ Service gRPC est prêt !${NC}"
else
    echo -e "${RED}❌ Service gRPC n'est pas accessible${NC}"
    exit 1
fi

# Attendre encore un peu pour s'assurer que l'init est terminé
echo -e "${YELLOW}⏳ Attente de l'initialisation complète (10s)...${NC}"
sleep 10

# Lancer les tests
echo -e "${GREEN}🧪 Lancement des tests E2E...${NC}"
echo "=================================================="

npm test src/tests

# Afficher le résultat
if [ $? -eq 0 ]; then
    echo "=================================================="
    echo -e "${GREEN}🎉 Tous les tests sont passés avec succès !${NC}"
else
    echo "=================================================="
    echo -e "${RED}❌ Certains tests ont échoué${NC}"
    exit 1
fi 