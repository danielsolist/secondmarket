#!/bin/bash

echo "🔍 Diagnóstico de Errores - SecondMarket"
echo "========================================"
echo ""

# Colores
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

# 1. Verificar que los servidores estén corriendo
echo "1️⃣ Verificando servidores..."
echo ""

# Backend
if lsof -ti:5000 > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Backend corriendo en puerto 5000${NC}"
    
    # Probar endpoint
    if curl -s http://localhost:5000/api/locations/estados > /dev/null 2>&1; then
        echo -e "${GREEN}   ✅ API respondiendo correctamente${NC}"
    else
        echo -e "${RED}   ❌ API no responde${NC}"
    fi
else
    echo -e "${RED}❌ Backend NO está corriendo en puerto 5000${NC}"
fi

echo ""

# Frontend
if lsof -ti:3000 > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Frontend corriendo en puerto 3000${NC}"
    
    # Probar página
    if curl -s http://localhost:3000 > /dev/null 2>&1; then
        echo -e "${GREEN}   ✅ Página cargando${NC}"
    else
        echo -e "${RED}   ❌ Página no carga${NC}"
    fi
else
    echo -e "${RED}❌ Frontend NO está corriendo en puerto 3000${NC}"
fi

echo ""
echo "2️⃣ Verificando MongoDB..."
echo ""

if pgrep -f mongod > /dev/null; then
    echo -e "${GREEN}✅ MongoDB corriendo${NC}"
    
    # Verificar conexión
    if node -e "const mongoose = require('mongoose'); mongoose.connect('mongodb://localhost:27017/secondmarket').then(() => { console.log('   ✅ Conexión exitosa'); process.exit(0); }).catch(() => { console.log('   ❌ Error de conexión'); process.exit(1); })" 2>/dev/null; then
        :
    else
        echo -e "${RED}   ❌ No se puede conectar a MongoDB${NC}"
    fi
else
    echo -e "${RED}❌ MongoDB NO está corriendo${NC}"
fi

echo ""
echo "3️⃣ Probando endpoints del backend..."
echo ""

# Test estados
RESPONSE=$(curl -s -w "\n%{http_code}" http://localhost:5000/api/locations/estados 2>/dev/null)
HTTP_CODE=$(echo "$RESPONSE" | tail -n1)

if [ "$HTTP_CODE" = "200" ]; then
    echo -e "${GREEN}✅ GET /api/locations/estados - 200 OK${NC}"
else
    echo -e "${RED}❌ GET /api/locations/estados - Error $HTTP_CODE${NC}"
fi

# Test listings
RESPONSE=$(curl -s -w "\n%{http_code}" http://localhost:5000/api/listings 2>/dev/null)
HTTP_CODE=$(echo "$RESPONSE" | tail -n1)

if [ "$HTTP_CODE" = "200" ]; then
    echo -e "${GREEN}✅ GET /api/listings - 200 OK${NC}"
else
    echo -e "${RED}❌ GET /api/listings - Error $HTTP_CODE${NC}"
fi

echo ""
echo "4️⃣ Verificando configuración..."
echo ""

# Backend .env
if [ -f "backend/.env" ]; then
    echo -e "${GREEN}✅ backend/.env existe${NC}"
    
    if grep -q "MONGODB_URI" backend/.env; then
        echo -e "${GREEN}   ✅ MONGODB_URI configurado${NC}"
    else
        echo -e "${RED}   ❌ MONGODB_URI no configurado${NC}"
    fi
    
    if grep -q "JWT_SECRET" backend/.env; then
        echo -e "${GREEN}   ✅ JWT_SECRET configurado${NC}"
    else
        echo -e "${RED}   ❌ JWT_SECRET no configurado${NC}"
    fi
else
    echo -e "${RED}❌ backend/.env NO existe${NC}"
fi

echo ""

# Frontend .env
if [ -f "frontend/.env" ]; then
    echo -e "${GREEN}✅ frontend/.env existe${NC}"
    
    if grep -q "REACT_APP_API_URL" frontend/.env; then
        echo -e "${GREEN}   ✅ REACT_APP_API_URL configurado${NC}"
        API_URL=$(grep "REACT_APP_API_URL" frontend/.env | cut -d '=' -f2)
        echo "   URL: $API_URL"
    else
        echo -e "${RED}   ❌ REACT_APP_API_URL no configurado${NC}"
    fi
else
    echo -e "${RED}❌ frontend/.env NO existe${NC}"
fi

echo ""
echo "5️⃣ Verificando errores comunes..."
echo ""

# CORS
echo "Probando CORS..."
CORS_TEST=$(curl -s -H "Origin: http://localhost:3000" -H "Access-Control-Request-Method: GET" -X OPTIONS http://localhost:5000/api/locations/estados -I 2>/dev/null | grep -i "access-control")

if [ ! -z "$CORS_TEST" ]; then
    echo -e "${GREEN}✅ CORS configurado correctamente${NC}"
else
    echo -e "${YELLOW}⚠️  CORS podría tener problemas${NC}"
fi

echo ""
echo "========================================"
echo "📊 Resumen del Diagnóstico"
echo "========================================"
echo ""

# Contar problemas
PROBLEMS=0

if ! lsof -ti:5000 > /dev/null 2>&1; then
    ((PROBLEMS++))
    echo -e "${RED}• Backend no está corriendo${NC}"
fi

if ! lsof -ti:3000 > /dev/null 2>&1; then
    ((PROBLEMS++))
    echo -e "${RED}• Frontend no está corriendo${NC}"
fi

if ! pgrep -f mongod > /dev/null; then
    ((PROBLEMS++))
    echo -e "${RED}• MongoDB no está corriendo${NC}"
fi

if [ $PROBLEMS -eq 0 ]; then
    echo -e "${GREEN}✅ No se encontraron problemas obvios${NC}"
    echo ""
    echo "Si aún ves errores, por favor comparte:"
    echo "  1. Los errores específicos que ves en el navegador (consola)"
    echo "  2. Los errores en la terminal del backend"
    echo "  3. Los errores en la terminal del frontend"
else
    echo -e "${RED}❌ Se encontraron $PROBLEMS problemas${NC}"
    echo ""
    echo "Soluciones sugeridas:"
    
    if ! pgrep -f mongod > /dev/null; then
        echo "  • Iniciar MongoDB: brew services start mongodb-community"
    fi
    
    if ! lsof -ti:5000 > /dev/null 2>&1; then
        echo "  • Iniciar Backend: cd backend && npm run dev"
    fi
    
    if ! lsof -ti:3000 > /dev/null 2>&1; then
        echo "  • Iniciar Frontend: cd frontend && npm start"
    fi
fi

echo ""
