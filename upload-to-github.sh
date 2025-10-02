#!/bin/bash

# Script para subir SecondMarket a GitHub
# Usuario: danielsolist

# Colores para output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}╔════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║   SecondMarket - Upload to GitHub Script      ║${NC}"
echo -e "${BLUE}║   Usuario: danielsolist                        ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════╝${NC}"
echo ""

# Variables
GITHUB_USER="danielsolist"
REPO_NAME="secondmarket"
GITHUB_URL="https://github.com/${GITHUB_USER}/${REPO_NAME}.git"

# Función para mostrar errores
error_exit() {
    echo -e "${RED}❌ Error: $1${NC}" >&2
    exit 1
}

# Función para mostrar éxito
success() {
    echo -e "${GREEN}✅ $1${NC}"
}

# Función para mostrar advertencias
warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

# Función para mostrar info
info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Paso 1: Verificar que estamos en el directorio correcto
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}Paso 1: Verificando directorio${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

if [ ! -d ".git" ]; then
    error_exit "No estás en un repositorio Git. Ejecuta este script desde el directorio del proyecto."
fi

if [ ! -f "README.md" ]; then
    error_exit "No se encuentra README.md. ¿Estás en el directorio correcto?"
fi

success "Directorio verificado"
echo ""

# Paso 2: Verificar .gitignore
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}Paso 2: Verificando .gitignore${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

if [ ! -f ".gitignore" ]; then
    warning ".gitignore no existe, pero continuaremos..."
else
    success ".gitignore encontrado"
fi
echo ""

# Paso 3: Limpiar commits anteriores con node_modules
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}Paso 3: Limpiando repositorio${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

info "Eliminando commit anterior..."
git reset --soft HEAD~1 2>/dev/null || warning "No hay commits previos para eliminar"

info "Limpiando índice de Git..."
git rm -r --cached . 2>/dev/null || warning "Índice ya estaba limpio"

success "Repositorio limpiado"
echo ""

# Paso 4: Agregar archivos (excluyendo node_modules)
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}Paso 4: Agregando archivos${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

info "Agregando archivos al repositorio..."
git add . || error_exit "Error al agregar archivos"

# Verificar que node_modules NO esté incluido
if git status | grep -q "node_modules"; then
    warning "node_modules detectado en el índice, eliminando..."
    git rm -r --cached backend/node_modules 2>/dev/null
    git rm -r --cached frontend/node_modules 2>/dev/null
    success "node_modules eliminado del índice"
fi

success "Archivos agregados correctamente"
echo ""

# Paso 5: Mostrar resumen de archivos
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}Paso 5: Resumen de archivos${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

FILE_COUNT=$(git status --short | wc -l | tr -d ' ')
info "Archivos a subir: $FILE_COUNT"

# Mostrar algunos archivos importantes
echo ""
echo "Archivos principales:"
git status --short | grep -E "(README|package\.json|server\.js|App\.js)" | head -10
echo ""

# Paso 6: Crear commit
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}Paso 6: Creando commit${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

COMMIT_MESSAGE="feat: SecondMarket v1.0.1 - Aplicación completa de compra-venta

- Backend completo con Node.js, Express y MongoDB
- Frontend completo con React
- Sistema de autenticación JWT
- CRUD de usuarios y anuncios
- Sistema de intereses y notificaciones por email
- Filtrado por ubicación (32 estados mexicanos)
- Compartir en redes sociales
- Diseño responsive
- Todos los bugs corregidos
- Documentación completa"

git commit -m "$COMMIT_MESSAGE" || error_exit "Error al crear commit"
success "Commit creado exitosamente"
echo ""

# Paso 7: Verificar/Agregar remote
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}Paso 7: Configurando repositorio remoto${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

# Verificar si ya existe el remote
if git remote | grep -q "origin"; then
    warning "Remote 'origin' ya existe"
    CURRENT_URL=$(git remote get-url origin)
    info "URL actual: $CURRENT_URL"
    
    if [ "$CURRENT_URL" != "$GITHUB_URL" ]; then
        info "Actualizando URL del remote..."
        git remote set-url origin "$GITHUB_URL" || error_exit "Error al actualizar remote"
        success "Remote actualizado a: $GITHUB_URL"
    else
        success "Remote ya está configurado correctamente"
    fi
else
    info "Agregando remote 'origin'..."
    git remote add origin "$GITHUB_URL" || error_exit "Error al agregar remote"
    success "Remote agregado: $GITHUB_URL"
fi
echo ""

# Paso 8: Verificar rama
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}Paso 8: Verificando rama${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

CURRENT_BRANCH=$(git branch --show-current)
info "Rama actual: $CURRENT_BRANCH"

if [ "$CURRENT_BRANCH" != "main" ] && [ "$CURRENT_BRANCH" != "master" ]; then
    warning "La rama actual no es 'main' ni 'master'"
    read -p "¿Quieres renombrar la rama a 'main'? (s/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Ss]$ ]]; then
        git branch -M main
        CURRENT_BRANCH="main"
        success "Rama renombrada a 'main'"
    fi
fi
echo ""

# Paso 9: Subir a GitHub
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}Paso 9: Subiendo a GitHub${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

echo ""
warning "IMPORTANTE: GitHub te pedirá autenticación"
echo ""
info "Opciones de autenticación:"
echo "  1. Token de acceso personal (recomendado)"
echo "  2. Credenciales de GitHub"
echo ""
info "Si no tienes un token, créalo en:"
echo "  https://github.com/settings/tokens"
echo ""

read -p "Presiona ENTER para continuar con el push..." 

echo ""
info "Subiendo código a GitHub..."
echo ""

# Intentar push
if git push -u origin "$CURRENT_BRANCH"; then
    success "¡Código subido exitosamente a GitHub!"
else
    error_exit "Error al subir el código. Verifica tu autenticación."
fi

echo ""

# Paso 10: Resumen final
echo -e "${GREEN}╔════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║          ¡SUBIDA EXITOSA! 🎉                   ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${GREEN}✅ Tu código está ahora en GitHub${NC}"
echo ""
echo "📍 URL del repositorio:"
echo "   https://github.com/${GITHUB_USER}/${REPO_NAME}"
echo ""
echo "🔗 Para clonar el repositorio:"
echo "   git clone https://github.com/${GITHUB_USER}/${REPO_NAME}.git"
echo ""
echo "📚 Próximos pasos:"
echo "   1. Ve a GitHub y verifica que los archivos se subieron"
echo "   2. Asegúrate de que NO veas node_modules"
echo "   3. Actualiza la descripción del repositorio"
echo "   4. Agrega topics/tags al repositorio"
echo ""
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
