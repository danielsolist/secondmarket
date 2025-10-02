# Guía para Subir SecondMarket a GitHub

## 📋 Pasos para Subir el Código a GitHub

### 1. Crear Repositorio en GitHub

1. Ve a https://github.com
2. Haz clic en el botón "+" en la esquina superior derecha
3. Selecciona "New repository"
4. Configura el repositorio:
   - **Repository name**: `secondmarket` (o el nombre que prefieras)
   - **Description**: "Aplicación de compra-venta de productos de segunda mano en México"
   - **Visibility**: Public o Private (tu elección)
   - **NO marques** "Initialize this repository with a README"
5. Haz clic en "Create repository"

### 2. Limpiar el Repositorio Local

Ejecuta estos comandos en tu terminal:

```bash
# Ir al directorio del proyecto
cd ~/SegundaMano

# Eliminar el commit anterior que incluía node_modules
git reset --soft HEAD~1

# Limpiar el índice de Git
git rm -r --cached .

# Agregar solo los archivos que queremos
git add .gitignore
git add backend/ --ignore-errors
git add frontend/ --ignore-errors
git add .kiro/
git add *.md
git add *.sh

# Verificar que node_modules NO esté incluido
git status | grep node_modules
# Si ves node_modules, ejecuta: git rm -r --cached backend/node_modules frontend/node_modules
```

### 3. Hacer el Commit Correcto

```bash
# Crear el commit sin node_modules
git commit -m "feat: SecondMarket v1.0.1 - Aplicación completa

- Backend con Node.js, Express y MongoDB
- Frontend con React
- Sistema de autenticación JWT
- CRUD de usuarios y anuncios
- Sistema de intereses y notificaciones
- Filtrado por ubicación (32 estados mexicanos)
- Compartir en redes sociales
- Diseño responsive
- Documentación completa"
```

### 4. Conectar con GitHub

Reemplaza `TU_USUARIO` con tu nombre de usuario de GitHub:

```bash
# Agregar el repositorio remoto
git remote add origin https://github.com/TU_USUARIO/secondmarket.git

# Verificar que se agregó correctamente
git remote -v
```

### 5. Subir el Código

```bash
# Subir el código a GitHub
git push -u origin main

# Si tu rama se llama 'master' en lugar de 'main':
# git push -u origin master
```

### 6. Verificar en GitHub

1. Ve a tu repositorio en GitHub
2. Verifica que los archivos se hayan subido correctamente
3. Asegúrate de que NO veas las carpetas `node_modules`

---

## 🔧 Solución de Problemas

### Problema: "node_modules" sigue apareciendo

```bash
# Eliminar node_modules del índice de Git
git rm -r --cached backend/node_modules
git rm -r --cached frontend/node_modules

# Hacer commit de la eliminación
git commit -m "chore: remove node_modules from git"

# Subir los cambios
git push
```

### Problema: Error de autenticación

Si GitHub te pide autenticación:

1. **Opción 1 - Token de Acceso Personal (Recomendado)**:
   - Ve a GitHub → Settings → Developer settings → Personal access tokens
   - Genera un nuevo token con permisos de "repo"
   - Usa el token como contraseña cuando Git te lo pida

2. **Opción 2 - SSH**:
   ```bash
   # Generar clave SSH
   ssh-keygen -t ed25519 -C "tu_email@example.com"
   
   # Agregar la clave a GitHub
   # Copia el contenido de ~/.ssh/id_ed25519.pub
   # Y agrégalo en GitHub → Settings → SSH and GPG keys
   
   # Cambiar la URL del remoto a SSH
   git remote set-url origin git@github.com:TU_USUARIO/secondmarket.git
   ```

### Problema: La rama se llama "master" en lugar de "main"

```bash
# Renombrar la rama
git branch -M main

# Subir con el nuevo nombre
git push -u origin main
```

---

## 📦 Archivos que SE SUBEN

✅ Código fuente (backend y frontend)
✅ Archivos de configuración (.env.example, package.json)
✅ Documentación (README.md, etc.)
✅ Scripts de utilidad (.sh)
✅ Especificaciones (.kiro/specs/)

## 🚫 Archivos que NO SE SUBEN

❌ node_modules/
❌ .env (con credenciales reales)
❌ backend/uploads/ (archivos subidos por usuarios)
❌ frontend/build/
❌ .DS_Store

---

## 🎯 Comandos Rápidos (Resumen)

```bash
# 1. Limpiar y preparar
git reset --soft HEAD~1
git rm -r --cached .
git add .

# 2. Commit
git commit -m "feat: SecondMarket v1.0.1 - Aplicación completa"

# 3. Conectar con GitHub (reemplaza TU_USUARIO)
git remote add origin https://github.com/TU_USUARIO/secondmarket.git

# 4. Subir
git push -u origin main
```

---

## 📝 Después de Subir

### Actualizar el README en GitHub

Considera agregar badges al README:

```markdown
# SecondMarket 🛍️

![Version](https://img.shields.io/badge/version-1.0.1-blue)
![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-green)
![MongoDB](https://img.shields.io/badge/mongodb-%3E%3D6.0.0-green)
![React](https://img.shields.io/badge/react-18.3.1-blue)
```

### Configurar GitHub Pages (Opcional)

Si quieres hospedar el frontend en GitHub Pages:

```bash
# Instalar gh-pages
cd frontend
npm install --save-dev gh-pages

# Agregar scripts en package.json
"homepage": "https://TU_USUARIO.github.io/secondmarket",
"predeploy": "npm run build",
"deploy": "gh-pages -d build"

# Desplegar
npm run deploy
```

---

## ✅ Checklist Final

- [ ] Repositorio creado en GitHub
- [ ] .gitignore configurado correctamente
- [ ] node_modules NO incluido en el commit
- [ ] Código subido exitosamente
- [ ] README.md visible en GitHub
- [ ] Archivos .env.example incluidos (sin credenciales reales)
- [ ] Documentación completa subida

---

**¡Listo!** Tu código ahora está en GitHub y otros desarrolladores pueden clonarlo con:

```bash
git clone https://github.com/TU_USUARIO/secondmarket.git
cd secondmarket
cd backend && npm install
cd ../frontend && npm install
```
