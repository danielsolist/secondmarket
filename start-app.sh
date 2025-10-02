#!/bin/bash

# Script para iniciar la aplicación SecondMarket
# Ejecuta todas las verificaciones y arranca backend y frontend

echo "🚀 Iniciando SecondMarket..."
echo ""

# Colores para output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 1. Verificar MongoDB
echo "📊 Verificando MongoDB..."
if pgrep -f mongod > /dev/null; then
    echo -e "${GREEN}✅ MongoDB está corriendo${NC}"
else
    echo -e "${RED}❌ MongoDB no está corriendo${NC}"
    echo "Iniciando MongoDB..."
    brew services start mongodb-community
    sleep 3
fi
echo ""

# 2. Verificar Backend
echo "🔧 Verificando Backend..."
cd backend
if node verify-backend.js > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Backend verificado (20/20 checks)${NC}"
else
    echo -e "${RED}❌ Backend tiene problemas${NC}"
    echo "Ejecuta: cd backend && node verify-backend.js"
    exit 1
fi
cd ..
echo ""

# 3. Verificar Frontend
echo "⚛️  Verificando Frontend..."
cd frontend
if node verify-frontend.js > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Frontend verificado (40/40 checks)${NC}"
else
    echo -e "${RED}❌ Frontend tiene problemas${NC}"
    echo "Ejecuta: cd frontend && node verify-frontend.js"
    exit 1
fi
cd ..
echo ""

# 4. Mostrar instrucciones
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${GREEN}🎉 ¡Todo verificado! La aplicación está lista.${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Para iniciar la aplicación, abre 2 terminales:"
echo ""
echo -e "${YELLOW}Terminal 1 - Backend:${NC}"
echo "  cd backend"
echo "  npm run dev"
echo ""
echo -e "${YELLOW}Terminal 2 - Frontend:${NC}"
echo "  cd frontend"
echo "  npm start"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "URLs:"
echo "  Backend:  http://localhost:5000"
echo "  Frontend: http://localhost:3000"
echo ""
echo "Documentación:"
echo "  - FINAL_VERIFICATION_REPORT.md"
echo "  - TESTING_CHECKLIST.md"
echo "  - README.md"
echo ""
