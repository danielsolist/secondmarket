# SecondMarket - Guía Rápida de Testing

## 🚀 Inicio Rápido (5 minutos)

### 1. Instalar Dependencias

```bash
# Backend
cd backend
npm install

# Frontend (en otra terminal)
cd frontend
npm install
```

### 2. Iniciar MongoDB

```bash
# macOS con Homebrew
brew services start mongodb-community

# O verificar si ya está corriendo
pgrep -x mongod
```

### 3. Ejecutar Seed de Datos

```bash
cd backend
npm run seed
```

**Resultado esperado:**
```
✓ Connected to MongoDB
✓ Cleared existing data
✓ Created state: Aguascalientes
  ✓ Created 11 municipalities
✓ Created state: Baja California
  ✓ Created 5 municipalities
...
✓ Seed completed successfully!
Total states: 32
Total municipalities: 300+
```

### 4. Iniciar Aplicación

```bash
# Terminal 1 - Backend
cd backend
npm start
# Debe mostrar: Server running on port 5000

# Terminal 2 - Frontend
cd frontend
npm start
# Debe abrir http://localhost:3000 automáticamente
```

---

## ✅ Checklist de Pruebas Rápidas (15 minutos)

### Prueba 1: Registro de Usuario (2 min)
1. ✅ Ir a http://localhost:3000
2. ✅ Clic en "Registrarse"
3. ✅ Llenar formulario:
   - Email: `test1@example.com`
   - Contraseña: `12345678`
   - Nombre: `Usuario Test`
   - Teléfono: `5512345678`
   - Estado: Cualquiera
   - Municipio: Cualquiera
4. ✅ Verificar: Redirige a home y muestra usuario en navbar

### Prueba 2: Crear Anuncio (3 min)
1. ✅ Clic en "Mis Anuncios"
2. ✅ Clic en "Crear Nuevo Anuncio"
3. ✅ Llenar formulario:
   - Título: `iPhone 12 Pro`
   - Descripción: `En excelente estado`
   - Precio: `8500`
   - Estado y Municipio
   - Subir 1-2 imágenes
4. ✅ Verificar: Anuncio aparece en "Mis Anuncios"

### Prueba 3: Filtros (2 min)
1. ✅ Ir a página principal
2. ✅ Seleccionar un estado en filtros
3. ✅ Verificar: Solo muestra anuncios de ese estado
4. ✅ Seleccionar municipio
5. ✅ Verificar: Filtra correctamente

### Prueba 4: Vista Detallada y Compartir (2 min)
1. ✅ Clic en cualquier anuncio
2. ✅ Verificar: Muestra toda la información
3. ✅ Clic en "Copiar URL"
4. ✅ Verificar: Muestra mensaje "URL copiada"
5. ✅ Probar botones de redes sociales

### Prueba 5: Expresar Interés (3 min)
1. ✅ Crear segundo usuario: `test2@example.com`
2. ✅ Ver anuncio del primer usuario
3. ✅ Clic en "Estoy Interesado"
4. ✅ Escribir mensaje opcional
5. ✅ Verificar: Muestra confirmación
6. ✅ Cerrar sesión e iniciar con primer usuario
7. ✅ Ir a "Intereses Recibidos"
8. ✅ Verificar: Aparece el interés

### Prueba 6: Responsive (3 min)
1. ✅ Abrir DevTools (F12)
2. ✅ Toggle Device Toolbar
3. ✅ Probar en iPhone (375px)
4. ✅ Verificar: Layout móvil correcto
5. ✅ Probar en iPad (768px)
6. ✅ Verificar: Layout tablet correcto

---

## 🧪 Pruebas con cURL (Opcional)

### Verificar Estados
```bash
curl http://localhost:5000/api/locations/estados
```

### Registrar Usuario
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "curl@test.com",
    "password": "12345678",
    "nombre": "Test cURL",
    "telefono": "5512345678",
    "estado": "ESTADO_ID",
    "municipio": "MUNICIPIO_ID"
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "curl@test.com",
    "password": "12345678"
  }'
```

### Listar Anuncios
```bash
curl http://localhost:5000/api/listings
```

---

## 🐛 Solución de Problemas Comunes

### MongoDB no conecta
```bash
# Verificar estado
brew services list

# Iniciar
brew services start mongodb-community

# Ver logs
tail -f /usr/local/var/log/mongodb/mongo.log
```

### Puerto 5000 ocupado
```bash
# Encontrar proceso
lsof -ti:5000

# Matar proceso
kill -9 $(lsof -ti:5000)
```

### Puerto 3000 ocupado
```bash
# Encontrar proceso
lsof -ti:3000

# Matar proceso
kill -9 $(lsof -ti:3000)
```

### Dependencias no instaladas
```bash
# Backend
cd backend
rm -rf node_modules package-lock.json
npm install

# Frontend
cd frontend
rm -rf node_modules package-lock.json
npm install
```

### Seed falla
```bash
# Limpiar base de datos
mongosh secondmarket
db.dropDatabase()
exit

# Volver a ejecutar seed
cd backend
npm run seed
```

---

## 📊 Validación Automatizada

Ejecuta el script de validación para verificar que todo está configurado:

```bash
./test-validation.sh
```

Este script verifica:
- ✅ Node.js y npm instalados
- ✅ MongoDB ejecutándose
- ✅ Estructura de directorios
- ✅ Archivos de configuración
- ✅ Dependencias instaladas
- ✅ Todos los modelos, rutas y componentes

---

## 📝 Casos de Prueba Detallados

Para pruebas exhaustivas, consulta: **TESTING_VALIDATION_REPORT.md**

Incluye:
- Pruebas de registro y autenticación
- CRUD completo de anuncios
- Filtrado y búsqueda
- Sistema de intereses
- Notificaciones por email
- Responsive design
- Seguridad y autorización
- Performance

---

## ✨ Funcionalidades Clave a Validar

### ✅ Autenticación
- [x] Registro con validación de 8 caracteres
- [x] Login con JWT
- [x] Persistencia de sesión
- [x] Logout

### ✅ Anuncios
- [x] Crear con múltiples imágenes
- [x] Editar propios anuncios
- [x] Eliminar propios anuncios
- [x] Ver todos los anuncios (público)

### ✅ Ubicación
- [x] 32 estados de México
- [x] Municipios por estado
- [x] Filtrado por estado
- [x] Filtrado por municipio

### ✅ Compartir
- [x] Facebook
- [x] WhatsApp
- [x] Twitter
- [x] Email
- [x] Copiar URL

### ✅ Intereses
- [x] Expresar interés
- [x] Ver intereses recibidos
- [x] Ver intereses enviados
- [x] Marcar como leído

### ✅ Responsive
- [x] Móvil (< 768px)
- [x] Tablet (768px - 1024px)
- [x] Desktop (> 1024px)

### ✅ Acceso Público
- [x] Ver anuncios sin login
- [x] Usar filtros sin login
- [x] Compartir sin login
- [x] Redirigir a login para acciones protegidas

---

## 🎯 Métricas de Éxito

### Performance
- ⚡ Página principal carga en < 3s
- ⚡ Filtros responden en < 500ms
- ⚡ Upload de imágenes con preview inmediato

### Usabilidad
- 👍 Navegación intuitiva (máx 3 clics)
- 👍 Mensajes de error claros
- 👍 Feedback visual en todas las acciones
- 👍 Touch targets > 44px en móvil

### Seguridad
- 🔒 Contraseñas hasheadas
- 🔒 JWT con expiración
- 🔒 Validación en backend
- 🔒 Autorización en operaciones

---

## 📞 Soporte

Si encuentras problemas:
1. Revisa **TESTING_VALIDATION_REPORT.md** para soluciones detalladas
2. Ejecuta `./test-validation.sh` para diagnóstico
3. Verifica logs del backend y frontend
4. Consulta la sección de "Problemas Comunes" arriba

---

**¡Listo para probar! 🚀**
