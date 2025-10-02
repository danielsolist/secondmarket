# Testing y Validación Final - SecondMarket

## Resumen Ejecutivo

Este documento proporciona una guía completa para probar y validar todas las funcionalidades de SecondMarket. Incluye instrucciones paso a paso, casos de prueba y criterios de aceptación.

---

## Pre-requisitos

### Backend
- Node.js v18+ instalado
- MongoDB instalado y ejecutándose
- Dependencias instaladas: `cd backend && npm install`
- Archivo `.env` configurado (copiar de `.env.example`)

### Frontend
- Node.js v18+ instalado
- Dependencias instaladas: `cd frontend && npm install`
- Archivo `.env` configurado con `REACT_APP_API_URL=http://localhost:5000/api`

---

## 1. Ejecutar Seed de Estados y Municipios

### Objetivo
Cargar los 32 estados de México y sus municipios en la base de datos.

### Pasos
```bash
# 1. Asegurarse de que MongoDB está ejecutándose
# macOS con Homebrew:
brew services start mongodb-community

# O iniciar manualmente:
mongod --config /usr/local/etc/mongod.conf

# 2. Ejecutar el seed desde el directorio backend
cd backend
npm run seed
```

### Criterios de Éxito
- ✅ Se muestran 32 estados creados
- ✅ Se muestran más de 300 municipios creados
- ✅ No hay errores de conexión a MongoDB
- ✅ El script termina con "Seed completed successfully!"

### Verificación Manual
```bash
# Conectarse a MongoDB y verificar
mongosh secondmarket

# Verificar estados
db.estados.countDocuments()  // Debe retornar 32

# Verificar municipios
db.municipios.countDocuments()  // Debe retornar > 300

# Ver algunos ejemplos
db.estados.find().limit(5)
db.municipios.find().limit(5)
```

---

## 2. Probar Flujo Completo de Registro y Login

### Objetivo
Validar que los usuarios pueden registrarse, iniciar sesión y mantener su sesión.

### Pasos de Prueba

#### 2.1 Registro de Usuario Nuevo

**Pasos:**
1. Iniciar backend: `cd backend && npm start`
2. Iniciar frontend: `cd frontend && npm start`
3. Navegar a `http://localhost:3000`
4. Hacer clic en "Registrarse"
5. Completar el formulario:
   - Email: `test@example.com`
   - Contraseña: `12345678` (exactamente 8 caracteres)
   - Nombre: `Usuario Test`
   - Teléfono: `5512345678`
   - Estado: Seleccionar cualquier estado
   - Municipio: Seleccionar cualquier municipio
6. Hacer clic en "Registrarse"

**Criterios de Éxito:**
- ✅ Los municipios se cargan dinámicamente al seleccionar un estado
- ✅ La contraseña debe tener exactamente 8 caracteres (validación)
- ✅ El email debe tener formato válido (validación)
- ✅ Después del registro, se redirige automáticamente a la página principal
- ✅ El navbar muestra el nombre del usuario y opciones de usuario autenticado
- ✅ Se muestra un mensaje de éxito (toast notification)

**Casos de Error a Probar:**
- ❌ Contraseña con menos de 8 caracteres → Debe mostrar error
- ❌ Contraseña con más de 8 caracteres → Debe mostrar error
- ❌ Email inválido → Debe mostrar error
- ❌ Email duplicado → Debe mostrar "Email ya registrado"
- ❌ Campos vacíos → Debe mostrar errores de validación

#### 2.2 Login de Usuario Existente

**Pasos:**
1. Hacer clic en "Cerrar Sesión" (si está autenticado)
2. Hacer clic en "Iniciar Sesión"
3. Ingresar credenciales:
   - Email: `test@example.com`
   - Contraseña: `12345678`
4. Hacer clic en "Iniciar Sesión"

**Criterios de Éxito:**
- ✅ Se redirige a la página principal
- ✅ El navbar muestra el usuario autenticado
- ✅ El token JWT se guarda en localStorage
- ✅ Se muestra mensaje de bienvenida

**Casos de Error a Probar:**
- ❌ Contraseña incorrecta → Debe mostrar "Credenciales inválidas"
- ❌ Email no registrado → Debe mostrar "Credenciales inválidas"
- ❌ Campos vacíos → Debe mostrar errores de validación

#### 2.3 Persistencia de Sesión

**Pasos:**
1. Iniciar sesión
2. Recargar la página (F5)
3. Cerrar y abrir el navegador
4. Navegar a `http://localhost:3000`

**Criterios de Éxito:**
- ✅ La sesión se mantiene después de recargar
- ✅ La sesión se mantiene después de cerrar/abrir navegador
- ✅ El usuario sigue autenticado

#### 2.4 Cerrar Sesión

**Pasos:**
1. Hacer clic en el menú de usuario en el navbar
2. Hacer clic en "Cerrar Sesión"

**Criterios de Éxito:**
- ✅ Se elimina el token de localStorage
- ✅ Se redirige a la página principal
- ✅ El navbar muestra opciones de usuario no autenticado
- ✅ No se puede acceder a rutas protegidas

---

## 3. Probar Creación, Edición y Eliminación de Anuncios

### Objetivo
Validar el CRUD completo de anuncios con upload de imágenes.

### 3.1 Crear Anuncio

**Pasos:**
1. Iniciar sesión con un usuario
2. Hacer clic en "Mis Anuncios" en el navbar
3. Hacer clic en "Crear Nuevo Anuncio"
4. Completar el formulario:
   - Título: `iPhone 12 Pro en excelente estado`
   - Descripción: `iPhone 12 Pro de 128GB, color azul pacífico. Incluye cargador original y caja. Sin detalles, batería al 95%.`
   - Precio: `8500`
   - Estado: Seleccionar un estado
   - Municipio: Seleccionar un municipio
   - Imágenes: Subir 2-3 imágenes (JPG, PNG o WebP)
5. Hacer clic en "Publicar Anuncio"

**Criterios de Éxito:**
- ✅ Se muestra preview de las imágenes antes de subir
- ✅ Se pueden subir múltiples imágenes (hasta 5)
- ✅ Solo se aceptan formatos JPG, PNG, WebP
- ✅ El tamaño máximo por imagen es 5MB
- ✅ Los municipios se filtran por estado seleccionado
- ✅ Después de crear, se redirige a "Mis Anuncios"
- ✅ El nuevo anuncio aparece en la lista
- ✅ Se muestra mensaje de éxito

**Casos de Error a Probar:**
- ❌ Título vacío → Debe mostrar error
- ❌ Descripción vacía → Debe mostrar error
- ❌ Precio negativo o cero → Debe mostrar error
- ❌ Sin imágenes → Debe mostrar error "Mínimo 1 imagen"
- ❌ Más de 5 imágenes → Debe mostrar error
- ❌ Archivo no válido (PDF, TXT) → Debe rechazar
- ❌ Imagen mayor a 5MB → Debe mostrar error

### 3.2 Ver Mis Anuncios

**Pasos:**
1. Navegar a "Mis Anuncios"

**Criterios de Éxito:**
- ✅ Se muestran todos los anuncios del usuario autenticado
- ✅ Cada anuncio muestra: imagen, título, precio, ubicación, fecha
- ✅ Se muestran botones de "Editar" y "Eliminar"
- ✅ Si no hay anuncios, se muestra mensaje apropiado

### 3.3 Editar Anuncio

**Pasos:**
1. En "Mis Anuncios", hacer clic en "Editar" en un anuncio
2. Modificar algunos campos:
   - Cambiar precio a `8000`
   - Actualizar descripción
   - Agregar o quitar imágenes
3. Hacer clic en "Actualizar Anuncio"

**Criterios de Éxito:**
- ✅ El formulario se pre-carga con los datos existentes
- ✅ Se muestran las imágenes actuales
- ✅ Se pueden agregar nuevas imágenes
- ✅ Se pueden eliminar imágenes existentes
- ✅ Los cambios se guardan correctamente
- ✅ Se redirige a "Mis Anuncios"
- ✅ Se muestra mensaje de éxito

**Validación de Seguridad:**
- ❌ Intentar editar anuncio de otro usuario (manipulando URL) → Debe retornar 403 Forbidden

### 3.4 Eliminar Anuncio

**Pasos:**
1. En "Mis Anuncios", hacer clic en "Eliminar" en un anuncio
2. Confirmar la eliminación en el modal

**Criterios de Éxito:**
- ✅ Se muestra modal de confirmación
- ✅ Al confirmar, el anuncio se elimina
- ✅ El anuncio desaparece de la lista
- ✅ Se muestra mensaje de éxito
- ✅ Las imágenes asociadas se eliminan del servidor

**Validación de Seguridad:**
- ❌ Intentar eliminar anuncio de otro usuario → Debe retornar 403 Forbidden

---

## 4. Probar Filtrado por Ubicación

### Objetivo
Validar que los filtros de estado y municipio funcionan correctamente.

### Pasos de Prueba

#### 4.1 Filtro por Estado

**Pasos:**
1. Navegar a la página principal (HomePage)
2. En la barra de filtros, seleccionar un estado específico (ej: "Ciudad de México")
3. Observar los resultados

**Criterios de Éxito:**
- ✅ Solo se muestran anuncios del estado seleccionado
- ✅ El selector de municipios se actualiza con municipios de ese estado
- ✅ Los resultados se actualizan en tiempo real
- ✅ El contador de resultados es correcto

#### 4.2 Filtro por Estado y Municipio

**Pasos:**
1. Seleccionar un estado
2. Seleccionar un municipio específico
3. Observar los resultados

**Criterios de Éxito:**
- ✅ Solo se muestran anuncios del estado Y municipio seleccionados
- ✅ Los filtros se aplican correctamente
- ✅ Los resultados se actualizan en tiempo real

#### 4.3 Búsqueda por Texto

**Pasos:**
1. En la barra de búsqueda, escribir "iPhone"
2. Observar los resultados

**Criterios de Éxito:**
- ✅ Se muestran anuncios que contienen "iPhone" en título o descripción
- ✅ La búsqueda no es case-sensitive
- ✅ Los resultados se actualizan mientras se escribe (debounce)

#### 4.4 Combinar Filtros

**Pasos:**
1. Seleccionar un estado
2. Seleccionar un municipio
3. Escribir texto de búsqueda
4. Observar los resultados

**Criterios de Éxito:**
- ✅ Todos los filtros se aplican simultáneamente
- ✅ Los resultados cumplen con todos los criterios

#### 4.5 Limpiar Filtros

**Pasos:**
1. Aplicar varios filtros
2. Hacer clic en "Limpiar Filtros"

**Criterios de Éxito:**
- ✅ Todos los filtros se resetean
- ✅ Se muestran todos los anuncios
- ✅ Los selectores vuelven a su estado inicial

---

## 5. Probar Compartir en Redes Sociales

### Objetivo
Validar que los botones de compartir funcionan correctamente.

### Pasos de Prueba

#### 5.1 Ver Detalle de Anuncio

**Pasos:**
1. Navegar a la página principal
2. Hacer clic en cualquier anuncio
3. Observar la vista detallada

**Criterios de Éxito:**
- ✅ Se muestra toda la información del anuncio
- ✅ Se muestra galería de imágenes con carrusel
- ✅ Se muestran botones de compartir
- ✅ Se incrementa el contador de vistas

#### 5.2 Compartir en Facebook

**Pasos:**
1. En la vista detallada, hacer clic en el botón de Facebook
2. Observar que se abre una ventana de Facebook

**Criterios de Éxito:**
- ✅ Se abre ventana de compartir de Facebook
- ✅ La URL del anuncio está incluida
- ✅ El título del anuncio aparece en el preview

#### 5.3 Compartir en WhatsApp

**Pasos:**
1. Hacer clic en el botón de WhatsApp
2. Observar que se abre WhatsApp Web o la app

**Criterios de Éxito:**
- ✅ Se abre WhatsApp con el mensaje pre-cargado
- ✅ El mensaje incluye el título y la URL del anuncio

#### 5.4 Compartir en Twitter

**Pasos:**
1. Hacer clic en el botón de Twitter
2. Observar que se abre Twitter

**Criterios de Éxito:**
- ✅ Se abre ventana de compartir de Twitter
- ✅ El tweet incluye el título y la URL

#### 5.5 Compartir por Email

**Pasos:**
1. Hacer clic en el botón de Email
2. Observar que se abre el cliente de correo

**Criterios de Éxito:**
- ✅ Se abre el cliente de correo predeterminado
- ✅ El asunto incluye el título del anuncio
- ✅ El cuerpo incluye la URL

#### 5.6 Copiar URL

**Pasos:**
1. Hacer clic en el botón "Copiar URL"
2. Pegar en un editor de texto (Cmd+V)

**Criterios de Éxito:**
- ✅ La URL se copia al portapapeles
- ✅ Se muestra mensaje de confirmación "URL copiada"
- ✅ La URL copiada es correcta y funcional

---

## 6. Probar Expresión de Interés y Envío de Emails

### Objetivo
Validar el sistema de notificaciones de interés entre usuarios.

### Pre-requisitos
- Configurar credenciales de email válidas en `backend/.env`:
  ```
  EMAIL_HOST=smtp.gmail.com
  EMAIL_PORT=587
  EMAIL_USER=tu_email@gmail.com
  EMAIL_PASS=tu_contraseña_app
  ```
- Para Gmail, usar "Contraseña de aplicación" (no la contraseña normal)

### Pasos de Prueba

#### 6.1 Expresar Interés (Usuario Autenticado)

**Pasos:**
1. Crear dos usuarios diferentes:
   - Usuario A (vendedor): `vendedor@test.com`
   - Usuario B (comprador): `comprador@test.com`
2. Con Usuario A, crear un anuncio
3. Cerrar sesión
4. Iniciar sesión con Usuario B
5. Navegar al anuncio de Usuario A
6. Hacer clic en "Estoy Interesado"
7. Opcionalmente, escribir un mensaje
8. Confirmar

**Criterios de Éxito:**
- ✅ Se muestra modal de confirmación
- ✅ Se puede agregar un mensaje opcional
- ✅ Se envía la notificación
- ✅ Se muestra mensaje de éxito
- ✅ El botón cambia a "Ya expresaste interés" (deshabilitado)
- ✅ Usuario A recibe un email con:
  - Información del anuncio
  - Datos de contacto de Usuario B
  - Mensaje opcional (si se incluyó)
  - Enlace al anuncio

**Validaciones:**
- ❌ Usuario no autenticado → Debe redirigir a login
- ❌ Expresar interés en propio anuncio → Debe estar deshabilitado
- ❌ Expresar interés dos veces → Debe mostrar error "Ya expresaste interés"

#### 6.2 Ver Intereses Recibidos

**Pasos:**
1. Iniciar sesión con Usuario A (vendedor)
2. Navegar a "Perfil" → "Intereses Recibidos"

**Criterios de Éxito:**
- ✅ Se muestra lista de todos los intereses recibidos
- ✅ Cada interés muestra:
  - Anuncio relacionado
  - Usuario interesado (nombre, email, teléfono)
  - Mensaje (si existe)
  - Fecha
  - Estado (leído/no leído)
- ✅ Los intereses no leídos se destacan visualmente
- ✅ Se puede marcar como leído

#### 6.3 Ver Intereses Enviados

**Pasos:**
1. Iniciar sesión con Usuario B (comprador)
2. Navegar a "Perfil" → "Intereses Enviados"

**Criterios de Éxito:**
- ✅ Se muestra lista de todos los intereses enviados
- ✅ Cada interés muestra:
  - Anuncio relacionado
  - Vendedor
  - Mensaje enviado
  - Fecha
- ✅ Se puede hacer clic para ver el anuncio

#### 6.4 Marcar Interés como Leído

**Pasos:**
1. En "Intereses Recibidos", hacer clic en "Marcar como leído"

**Criterios de Éxito:**
- ✅ El interés se marca como leído
- ✅ Cambia el estilo visual
- ✅ Se actualiza el contador de no leídos

---

## 7. Validar Responsive en Móvil, Tablet y Desktop

### Objetivo
Asegurar que la aplicación funciona correctamente en todos los tamaños de pantalla.

### Herramientas
- Chrome DevTools (F12 → Toggle Device Toolbar)
- Dispositivos reales (opcional)

### Breakpoints a Probar
- **Móvil**: 375px, 414px (iPhone)
- **Tablet**: 768px, 1024px (iPad)
- **Desktop**: 1280px, 1920px

### Páginas a Validar

#### 7.1 Página Principal (HomePage)

**Móvil (< 768px):**
- ✅ Grid de anuncios: 1 columna
- ✅ Navbar: Menú hamburguesa
- ✅ Filtros: Stack vertical
- ✅ Cards: Ancho completo
- ✅ Imágenes: Responsive
- ✅ Touch targets: Mínimo 44x44px
- ✅ Texto legible sin zoom

**Tablet (768px - 1024px):**
- ✅ Grid de anuncios: 2 columnas
- ✅ Navbar: Horizontal con todos los elementos
- ✅ Filtros: Horizontal
- ✅ Espaciado apropiado

**Desktop (> 1024px):**
- ✅ Grid de anuncios: 3-4 columnas
- ✅ Layout centrado con max-width
- ✅ Hover effects funcionan
- ✅ Espaciado generoso

#### 7.2 Vista Detallada de Anuncio

**Móvil:**
- ✅ Galería: Carrusel touch-friendly
- ✅ Información: Stack vertical
- ✅ Botones: Ancho completo
- ✅ Compartir: Iconos grandes

**Tablet:**
- ✅ Layout: 2 columnas (galería + info)
- ✅ Galería: Thumbnails visibles

**Desktop:**
- ✅ Layout: 2 columnas optimizado
- ✅ Galería: Zoom en hover

#### 7.3 Formularios (Registro, Login, Crear Anuncio)

**Móvil:**
- ✅ Inputs: Ancho completo
- ✅ Labels: Encima de inputs
- ✅ Botones: Ancho completo
- ✅ Selectores: Touch-friendly
- ✅ Upload de imágenes: Funcional

**Tablet/Desktop:**
- ✅ Formulario centrado
- ✅ Max-width apropiado
- ✅ Espaciado cómodo

#### 7.4 Navbar

**Móvil:**
- ✅ Logo visible
- ✅ Menú hamburguesa funcional
- ✅ Menú desplegable: Overlay completo
- ✅ Enlaces: Touch-friendly

**Tablet/Desktop:**
- ✅ Todos los enlaces visibles
- ✅ Dropdown de usuario funcional
- ✅ Hover effects

### Pruebas de Interacción Móvil

**Touch Gestures:**
- ✅ Swipe en galería de imágenes
- ✅ Tap en botones
- ✅ Scroll suave
- ✅ Pull to refresh (si aplica)

**Orientación:**
- ✅ Portrait: Layout correcto
- ✅ Landscape: Layout se adapta

---

## 8. Validar Acceso Público a Anuncios sin Autenticación

### Objetivo
Confirmar que los visitantes no registrados pueden ver anuncios.

### Pasos de Prueba

#### 8.1 Navegación Pública

**Pasos:**
1. Abrir navegador en modo incógnito
2. Navegar a `http://localhost:3000`
3. NO iniciar sesión

**Criterios de Éxito:**
- ✅ Se muestra la página principal con todos los anuncios
- ✅ Se pueden usar los filtros
- ✅ Se puede hacer clic en anuncios para ver detalles
- ✅ Se muestra toda la información del anuncio
- ✅ Se pueden usar botones de compartir
- ✅ El contador de vistas funciona

#### 8.2 Restricciones para No Autenticados

**Acciones que NO deben estar disponibles:**
- ❌ Crear anuncio → Redirige a login
- ❌ Editar anuncio → Redirige a login
- ❌ Eliminar anuncio → Redirige a login
- ❌ Expresar interés → Redirige a login
- ❌ Ver perfil → Redirige a login
- ❌ Ver mis anuncios → Redirige a login
- ❌ Ver intereses → Redirige a login

**Acciones que SÍ deben estar disponibles:**
- ✅ Ver página principal
- ✅ Ver detalle de anuncios
- ✅ Usar filtros
- ✅ Compartir en redes sociales
- ✅ Copiar URL
- ✅ Registrarse
- ✅ Iniciar sesión

#### 8.3 Flujo de Conversión

**Pasos:**
1. Como visitante no autenticado, navegar a un anuncio
2. Intentar hacer clic en "Estoy Interesado"
3. Observar redirección a login
4. Iniciar sesión o registrarse
5. Verificar que se redirige de vuelta al anuncio

**Criterios de Éxito:**
- ✅ Se redirige a login con mensaje apropiado
- ✅ Después de autenticarse, vuelve al anuncio
- ✅ Ahora puede expresar interés

---

## 9. Pruebas de Seguridad

### 9.1 Autenticación

- ✅ Token JWT expira después de 7 días
- ✅ Contraseñas hasheadas en BD (no texto plano)
- ✅ No se puede acceder a rutas protegidas sin token
- ✅ Token inválido retorna 401

### 9.2 Autorización

- ✅ Usuario solo puede editar sus propios anuncios
- ✅ Usuario solo puede eliminar sus propios anuncios
- ✅ Usuario solo puede actualizar su propio perfil
- ✅ Usuario solo puede eliminar su propia cuenta

### 9.3 Validación de Datos

- ✅ Validación de email en backend
- ✅ Validación de contraseña (8 caracteres)
- ✅ Sanitización de inputs
- ✅ Validación de tipos de archivo
- ✅ Límite de tamaño de archivo

---

## 10. Pruebas de Performance

### 10.1 Carga de Página

- ✅ Página principal carga en < 3 segundos
- ✅ Imágenes optimizadas (WebP preferido)
- ✅ Lazy loading de imágenes

### 10.2 Filtrado

- ✅ Filtros responden en < 500ms
- ✅ Búsqueda con debounce (no lag)

### 10.3 Upload de Imágenes

- ✅ Preview inmediato
- ✅ Progress indicator
- ✅ Manejo de errores

---

## 11. Checklist Final de Validación

### Backend
- [ ] Seed ejecutado correctamente
- [ ] Todos los endpoints responden
- [ ] Validaciones funcionan
- [ ] Autenticación JWT funciona
- [ ] Upload de imágenes funciona
- [ ] Emails se envían correctamente
- [ ] Errores se manejan apropiadamente

### Frontend
- [ ] Todas las páginas renderizan
- [ ] Navegación funciona
- [ ] Formularios validan correctamente
- [ ] Autenticación persiste
- [ ] Filtros funcionan
- [ ] Compartir en redes funciona
- [ ] Responsive en todos los dispositivos
- [ ] Acceso público funciona

### Funcionalidades Completas
- [ ] Registro y login
- [ ] CRUD de anuncios
- [ ] Filtrado por ubicación
- [ ] Compartir en redes sociales
- [ ] Sistema de intereses
- [ ] Notificaciones por email
- [ ] Gestión de perfil
- [ ] Responsive design

---

## 12. Comandos Útiles para Testing

### Backend
```bash
# Iniciar servidor
cd backend
npm start

# Ejecutar seed
npm run seed

# Ver logs de MongoDB
tail -f /usr/local/var/log/mongodb/mongo.log

# Conectar a MongoDB
mongosh secondmarket
```

### Frontend
```bash
# Iniciar aplicación
cd frontend
npm start

# Build de producción
npm run build

# Servir build
npx serve -s build
```

### Testing Manual
```bash
# Probar endpoint de API con curl
curl http://localhost:5000/api/locations/estados

# Probar registro
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"12345678","nombre":"Test","telefono":"5512345678","estado":"ID_ESTADO","municipio":"ID_MUNICIPIO"}'

# Probar login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"12345678"}'
```

---

## 13. Problemas Comunes y Soluciones

### MongoDB no se conecta
```bash
# Verificar que MongoDB está corriendo
brew services list

# Iniciar MongoDB
brew services start mongodb-community

# O manualmente
mongod --config /usr/local/etc/mongod.conf
```

### Puerto ya en uso
```bash
# Encontrar proceso en puerto 5000
lsof -ti:5000

# Matar proceso
kill -9 $(lsof -ti:5000)
```

### Emails no se envían
- Verificar credenciales en `.env`
- Para Gmail, usar "Contraseña de aplicación"
- Verificar que EMAIL_HOST y EMAIL_PORT son correctos

### Imágenes no se suben
- Verificar permisos de carpeta `backend/uploads`
- Verificar tamaño de archivo < 5MB
- Verificar formato (JPG, PNG, WebP)

---

## Conclusión

Este documento proporciona una guía completa para validar todas las funcionalidades de SecondMarket. Cada sección debe ser probada sistemáticamente para asegurar que la aplicación cumple con todos los requisitos especificados.

**Estado de Validación:** ⏳ Pendiente de ejecución

**Próximos Pasos:**
1. Ejecutar seed de base de datos
2. Iniciar backend y frontend
3. Seguir cada sección de pruebas
4. Documentar resultados
5. Corregir bugs encontrados
6. Re-validar funcionalidades corregidas

