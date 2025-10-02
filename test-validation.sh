#!/bin/bash

# SecondMarket - Script de Validación Automatizada
# Este script verifica que todos los componentes estén correctamente configurados

echo "🚀 SecondMarket - Validación Automatizada"
echo "=========================================="
echo ""

# Colores para output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Contadores
PASSED=0
FAILED=0

# Función para verificar
check() {
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓${NC} $1"
        ((PASSED++))
    else
        echo -e "${RED}✗${NC} $1"
        ((FAILED++))
    fi
}

# 1. Verificar Node.js
echo "📦 Verificando dependencias del sistema..."
node --version > /dev/null 2>&1
check "Node.js instalado"

npm --version > /dev/null 2>&1
check "npm instalado"

# 2. Verificar MongoDB
pgrep -x mongod > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓${NC} MongoDB está ejecutándose"
    ((PASSED++))
else
    echo -e "${YELLOW}⚠${NC} MongoDB no está ejecutándose"
    echo "  Ejecuta: brew services start mongodb-community"
fi

# 3. Verificar estructura de directorios
echo ""
echo "📁 Verificando estructura del proyecto..."

[ -d "backend" ]
check "Directorio backend existe"

[ -d "frontend" ]
check "Directorio frontend existe"

[ -f "backend/server.js" ]
check "Archivo backend/server.js existe"

[ -f "frontend/src/App.js" ]
check "Archivo frontend/src/App.js existe"

# 4. Verificar archivos de configuración
echo ""
echo "⚙️  Verificando configuración..."

[ -f "backend/.env" ]
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓${NC} backend/.env existe"
    ((PASSED++))
else
    echo -e "${YELLOW}⚠${NC} backend/.env no existe"
    echo "  Copia backend/.env.example a backend/.env"
fi

[ -f "backend/package.json" ]
check "backend/package.json existe"

[ -f "frontend/package.json" ]
check "frontend/package.json existe"

# 5. Verificar dependencias instaladas
echo ""
echo "📚 Verificando dependencias..."

[ -d "backend/node_modules" ]
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓${NC} Dependencias de backend instaladas"
    ((PASSED++))
else
    echo -e "${YELLOW}⚠${NC} Dependencias de backend no instaladas"
    echo "  Ejecuta: cd backend && npm install"
fi

[ -d "frontend/node_modules" ]
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓${NC} Dependencias de frontend instaladas"
    ((PASSED++))
else
    echo -e "${YELLOW}⚠${NC} Dependencias de frontend no instaladas"
    echo "  Ejecuta: cd frontend && npm install"
fi

# 6. Verificar modelos
echo ""
echo "🗄️  Verificando modelos de base de datos..."

[ -f "backend/models/Estado.js" ]
check "Modelo Estado existe"

[ -f "backend/models/Municipio.js" ]
check "Modelo Municipio existe"

[ -f "backend/models/User.js" ]
check "Modelo User existe"

[ -f "backend/models/Listing.js" ]
check "Modelo Listing existe"

[ -f "backend/models/Interest.js" ]
check "Modelo Interest existe"

# 7. Verificar rutas
echo ""
echo "🛣️  Verificando rutas de API..."

[ -f "backend/routes/auth.js" ]
check "Rutas de autenticación existen"

[ -f "backend/routes/users.js" ]
check "Rutas de usuarios existen"

[ -f "backend/routes/locations.js" ]
check "Rutas de ubicaciones existen"

[ -f "backend/routes/listings.js" ]
check "Rutas de anuncios existen"

[ -f "backend/routes/interests.js" ]
check "Rutas de intereses existen"

# 8. Verificar middleware
echo ""
echo "🔒 Verificando middleware..."

[ -f "backend/middleware/auth.js" ]
check "Middleware de autenticación existe"

[ -f "backend/middleware/upload.js" ]
check "Middleware de upload existe"

[ -f "backend/middleware/errorHandler.js" ]
check "Middleware de errores existe"

# 9. Verificar componentes de frontend
echo ""
echo "⚛️  Verificando componentes de React..."

[ -f "frontend/src/components/Navbar.js" ]
check "Componente Navbar existe"

[ -f "frontend/src/components/ListingCard.js" ]
check "Componente ListingCard existe"

[ -f "frontend/src/components/FilterBar.js" ]
check "Componente FilterBar existe"

[ -f "frontend/src/components/ImageGallery.js" ]
check "Componente ImageGallery existe"

[ -f "frontend/src/components/ShareButtons.js" ]
check "Componente ShareButtons existe"

[ -f "frontend/src/components/InterestButton.js" ]
check "Componente InterestButton existe"

[ -f "frontend/src/components/LocationSelector.js" ]
check "Componente LocationSelector existe"

# 10. Verificar páginas
echo ""
echo "📄 Verificando páginas..."

[ -f "frontend/src/pages/HomePage.js" ]
check "Página principal existe"

[ -f "frontend/src/pages/LoginPage.js" ]
check "Página de login existe"

[ -f "frontend/src/pages/RegisterPage.js" ]
check "Página de registro existe"

[ -f "frontend/src/pages/ListingDetailPage.js" ]
check "Página de detalle existe"

[ -f "frontend/src/pages/CreateListingPage.js" ]
check "Página de crear anuncio existe"

[ -f "frontend/src/pages/MyListingsPage.js" ]
check "Página de mis anuncios existe"

[ -f "frontend/src/pages/ProfilePage.js" ]
check "Página de perfil existe"

[ -f "frontend/src/pages/InterestsPage.js" ]
check "Página de intereses existe"

# 11. Verificar script de seed
echo ""
echo "🌱 Verificando script de seed..."

[ -f "backend/scripts/seedMexico.js" ]
check "Script de seed existe"

# 12. Verificar servicios
echo ""
echo "📧 Verificando servicios..."

[ -f "backend/services/emailService.js" ]
check "Servicio de email existe"

# Resumen
echo ""
echo "=========================================="
echo "📊 Resumen de Validación"
echo "=========================================="
echo -e "${GREEN}Pasadas:${NC} $PASSED"
echo -e "${RED}Fallidas:${NC} $FAILED"
echo ""

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}✓ Todos los componentes están en su lugar${NC}"
    echo ""
    echo "🎯 Próximos pasos:"
    echo "1. Asegúrate de que MongoDB esté ejecutándose"
    echo "2. Ejecuta el seed: cd backend && npm run seed"
    echo "3. Inicia el backend: cd backend && npm start"
    echo "4. Inicia el frontend: cd frontend && npm start"
    echo "5. Abre http://localhost:3000 en tu navegador"
else
    echo -e "${YELLOW}⚠ Algunos componentes necesitan atención${NC}"
    echo "Revisa los mensajes arriba para más detalles"
fi

echo ""
