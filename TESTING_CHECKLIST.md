# SecondMarket - Testing and Validation Checklist

## Status: Task 19 - Testing y validación final

This document provides a comprehensive checklist for validating all functionality of the SecondMarket application.

---

## Prerequisites

### 1. Database Setup
- [ ] MongoDB is running on `localhost:27017`
- [ ] Run seed script: `node backend/scripts/seedMexico.js`
- [ ] Verify: Should see "✓ Seed completed successfully!" with 32 states loaded

### 2. Backend Setup
- [ ] Navigate to `backend/` directory
- [ ] Install dependencies: `npm install`
- [ ] Verify `.env` file exists with proper configuration
- [ ] Start backend server: `npm start`
- [ ] Verify: Server should be running on `http://localhost:5000`

### 3. Frontend Setup
- [ ] Navigate to `frontend/` directory
- [ ] Install dependencies: `npm install`
- [ ] Verify `.env` file exists with `REACT_APP_API_URL=http://localhost:5000/api`
- [ ] Start frontend: `npm start`
- [ ] Verify: App should open on `http://localhost:3000`

---

## Test Suite

### ✅ 1. Seed de Estados y Municipios

**Objetivo**: Verificar que la base de datos se carga correctamente con los catálogos geográficos.

**Pasos**:
1. Asegurar que MongoDB está corriendo
2. Ejecutar: `node backend/scripts/seedMexico.js`
3. Verificar output:
   - ✓ Connected to MongoDB
   - ✓ Cleared existing data
   - ✓ Created state: [32 estados]
   - ✓ Seed completed successfully!
   - Total states: 32
   - Total municipalities: [número total]

**Resultado Esperado**: 
- 32 estados cargados
- Múltiples municipios por estado
- Sin errores de conexión

---

### ✅ 2. Flujo Completo de Registro y Login

#### 2.1 Registro de Usuario

**Pasos**:
1. Abrir `http://localhost:3000`
2. Click en "Registrarse" en la navbar
3. Completar formulario:
   - Email: `test@example.com`
   - Contraseña: `12345678` (exactamente 8 caracteres)
   - Nombre: `Usuario Test`
   - Teléfono: `5551234567`
   - Estado: Seleccionar cualquier estado
   - Municipio: Seleccionar municipio del estado elegido
4. Click en "Registrarse"

**Resultado Esperado**:
- ✓ Redirección automática a la página principal
- ✓ Navbar muestra "Mi Perfil" y "Cerrar Sesión"
- ✓ Toast de confirmación: "Registro exitoso"
- ✓ Token JWT guardado en localStorage

**Validaciones a Probar**:
- [ ] Email inválido muestra error
- [ ] Contraseña menor a 8 caracteres muestra error
- [ ] Contraseña mayor a 8 caracteres muestra error
- [ ] Email duplicado muestra error
- [ ] Campos vacíos muestran error
- [ ] Municipios se cargan dinámicamente al seleccionar estado

#### 2.2 Login de Usuario

**Pasos**:
1. Si está logueado, hacer logout
2. Click en "Iniciar Sesión"
3. Ingresar credenciales:
   - Email: `test@example.com`
   - Contraseña: `12345678`
4. Click en "Iniciar Sesión"

**Resultado Esperado**:
- ✓ Redirección a página principal
- ✓ Navbar muestra opciones de usuario autenticado
- ✓ Toast de confirmación: "Inicio de sesión exitoso"

**Validaciones a Probar**:
- [ ] Credenciales incorrectas muestran error
- [ ] Email no registrado muestra error
- [ ] Contraseña incorrecta muestra error

#### 2.3 Persistencia de Sesión

**Pasos**:
1. Estando logueado, refrescar la página (F5)
2. Cerrar y reabrir el navegador
3. Navegar a `http://localhost:3000`

**Resultado Esperado**:
- ✓ Usuario permanece autenticado
- ✓ No se solicita login nuevamente

#### 2.4 Logout

**Pasos**:
1. Click en "Cerrar Sesión" en navbar
2. Verificar redirección

**Resultado Esperado**:
- ✓ Redirección a página principal
- ✓ Navbar muestra "Iniciar Sesión" y "Registrarse"
- ✓ Token removido de localStorage

---

### ✅ 3. Creación, Edición y Eliminación de Anuncios

#### 3.1 Crear Anuncio

**Pasos**:
1. Iniciar sesión
2. Click en "Mis Anuncios" en navbar
3. Click en "Crear Nuevo Anuncio"
4. Completar formulario:
   - Título: `iPhone 12 Pro en excelente estado`
   - Descripción: `iPhone 12 Pro de 128GB, color azul pacífico. Incluye cargador original y caja. Sin rayones, batería al 95%.`
   - Precio: `8500`
   - Estado: Seleccionar estado
   - Municipio: Seleccionar municipio
   - Imágenes: Subir 2-3 imágenes (JPG, PNG o WebP)
5. Click en "Publicar Anuncio"

**Resultado Esperado**:
- ✓ Preview de imágenes antes de subir
- ✓ Validación de campos requeridos
- ✓ Redirección a "Mis Anuncios"
- ✓ Anuncio aparece en la lista
- ✓ Toast de confirmación: "Anuncio creado exitosamente"

**Validaciones a Probar**:
- [ ] Título vacío muestra error
- [ ] Descripción vacía muestra error
- [ ] Precio negativo muestra error
- [ ] Sin imágenes muestra error
- [ ] Más de 5 imágenes muestra error
- [ ] Archivo no imagen muestra error
- [ ] Archivo mayor a 5MB muestra error

#### 3.2 Ver Anuncio Propio

**Pasos**:
1. En "Mis Anuncios", click en el anuncio creado
2. Verificar vista detallada

**Resultado Esperado**:
- ✓ Todas las imágenes se muestran en galería
- ✓ Información completa visible
- ✓ Botones "Editar" y "Eliminar" visibles
- ✓ NO se muestra botón "Estoy Interesado" (es anuncio propio)

#### 3.3 Editar Anuncio

**Pasos**:
1. En vista detallada del anuncio, click en "Editar"
2. Modificar:
   - Precio: `8000`
   - Descripción: Agregar texto adicional
3. Click en "Actualizar Anuncio"

**Resultado Esperado**:
- ✓ Formulario pre-cargado con datos actuales
- ✓ Imágenes existentes se muestran
- ✓ Cambios se guardan correctamente
- ✓ Redirección a vista detallada
- ✓ Toast de confirmación: "Anuncio actualizado"

**Validaciones a Probar**:
- [ ] Solo el propietario puede editar
- [ ] Validaciones funcionan igual que en creación

#### 3.4 Eliminar Anuncio

**Pasos**:
1. En vista detallada del anuncio, click en "Eliminar"
2. Confirmar en el diálogo de confirmación
3. Verificar redirección

**Resultado Esperado**:
- ✓ Modal de confirmación aparece
- ✓ Anuncio se elimina de la base de datos
- ✓ Redirección a "Mis Anuncios"
- ✓ Anuncio ya no aparece en la lista
- ✓ Toast de confirmación: "Anuncio eliminado"

**Validaciones a Probar**:
- [ ] Solo el propietario puede eliminar
- [ ] Cancelar en confirmación no elimina

---

### ✅ 4. Filtrado por Ubicación

#### 4.1 Filtro por Estado

**Pasos**:
1. Ir a página principal (HomePage)
2. Crear varios anuncios en diferentes estados (o usar múltiples usuarios)
3. En FilterBar, seleccionar un estado específico
4. Verificar resultados

**Resultado Esperado**:
- ✓ Solo se muestran anuncios del estado seleccionado
- ✓ Filtrado ocurre en tiempo real
- ✓ Contador de resultados se actualiza

#### 4.2 Filtro por Municipio

**Pasos**:
1. Con un estado seleccionado, elegir un municipio
2. Verificar resultados

**Resultado Esperado**:
- ✓ Selector de municipio se habilita al seleccionar estado
- ✓ Solo municipios del estado seleccionado aparecen
- ✓ Solo se muestran anuncios del municipio seleccionado
- ✓ Filtrado es más específico que solo estado

#### 4.3 Limpiar Filtros

**Pasos**:
1. Con filtros aplicados, click en "Limpiar Filtros"
2. Verificar resultados

**Resultado Esperado**:
- ✓ Todos los anuncios se muestran nuevamente
- ✓ Selectores vuelven a estado inicial
- ✓ Contador muestra total de anuncios

#### 4.4 Búsqueda por Texto

**Pasos**:
1. En FilterBar, escribir término de búsqueda (ej: "iPhone")
2. Verificar resultados

**Resultado Esperado**:
- ✓ Solo anuncios con el término en título o descripción se muestran
- ✓ Búsqueda es case-insensitive
- ✓ Búsqueda funciona en combinación con filtros de ubicación

---

### ✅ 5. Compartir en Redes Sociales

**Pasos**:
1. Abrir cualquier anuncio en vista detallada
2. Verificar botones de compartir en la sección ShareButtons
3. Probar cada opción:

#### 5.1 Compartir en Facebook
- Click en botón de Facebook
- Verificar que se abre ventana de Facebook con URL del anuncio

#### 5.2 Compartir en WhatsApp
- Click en botón de WhatsApp
- Verificar que se abre WhatsApp Web/App con mensaje pre-cargado

#### 5.3 Compartir en Twitter
- Click en botón de Twitter
- Verificar que se abre Twitter con tweet pre-cargado

#### 5.4 Compartir por Email
- Click en botón de Email
- Verificar que se abre cliente de correo con asunto y cuerpo

#### 5.5 Copiar URL
- Click en botón "Copiar URL"
- Verificar toast de confirmación: "URL copiada al portapapeles"
- Pegar en navegador y verificar que lleva al anuncio correcto

**Resultado Esperado**:
- ✓ Todos los botones funcionan correctamente
- ✓ URLs compartidas son correctas y accesibles
- ✓ Feedback visual en cada acción

---

### ✅ 6. Expresión de Interés y Envío de Emails

#### 6.1 Expresar Interés (Usuario Autenticado)

**Pasos**:
1. Crear segundo usuario o usar cuenta diferente
2. Navegar a un anuncio de otro usuario
3. Click en botón "Estoy Interesado"
4. Opcionalmente agregar mensaje personalizado
5. Confirmar

**Resultado Esperado**:
- ✓ Modal de confirmación aparece
- ✓ Campo de mensaje opcional funciona
- ✓ Toast de confirmación: "Interés registrado"
- ✓ Botón cambia a "Ya expresaste interés" (deshabilitado)

**Nota sobre Email**: 
- Si EMAIL_USER y EMAIL_PASS están configurados correctamente en `.env`, se enviará email al vendedor
- Si no, el interés se registra pero el email falla silenciosamente
- Para testing completo, configurar credenciales SMTP reales

#### 6.2 Ver Intereses Recibidos

**Pasos**:
1. Iniciar sesión como el vendedor (usuario que creó el anuncio)
2. Click en "Mi Perfil" → "Intereses"
3. Verificar pestaña "Recibidos"

**Resultado Esperado**:
- ✓ Lista de intereses en anuncios propios
- ✓ Información del usuario interesado visible
- ✓ Email y teléfono del interesado visible
- ✓ Mensaje personalizado (si lo hay) visible
- ✓ Indicador de "leído/no leído"

#### 6.3 Ver Intereses Enviados

**Pasos**:
1. Iniciar sesión como el usuario que expresó interés
2. Ir a "Mi Perfil" → "Intereses"
3. Verificar pestaña "Enviados"

**Resultado Esperado**:
- ✓ Lista de anuncios en los que expresó interés
- ✓ Información del anuncio visible
- ✓ Fecha de interés visible

#### 6.4 Marcar Interés como Leído

**Pasos**:
1. Como vendedor, en lista de intereses recibidos
2. Click en "Marcar como leído" en un interés no leído
3. Verificar cambio visual

**Resultado Esperado**:
- ✓ Indicador cambia a "leído"
- ✓ Estilo visual cambia (menos prominente)

**Validaciones a Probar**:
- [ ] Usuario no autenticado no puede expresar interés
- [ ] Usuario no puede expresar interés en sus propios anuncios
- [ ] No se puede expresar interés duplicado en mismo anuncio

---

### ✅ 7. Validar Responsive en Móvil, Tablet y Desktop

#### 7.1 Desktop (1280px+)

**Pasos**:
1. Abrir en navegador de escritorio
2. Verificar todas las páginas

**Resultado Esperado**:
- ✓ Grid de anuncios: 3-4 columnas
- ✓ Navbar horizontal completa
- ✓ Formularios centrados con ancho máximo
- ✓ Imágenes en galería: tamaño grande
- ✓ Filtros en barra lateral o horizontal
- ✓ Espaciado generoso

#### 7.2 Tablet (768px - 1024px)

**Pasos**:
1. Redimensionar navegador o usar DevTools
2. Verificar todas las páginas

**Resultado Esperado**:
- ✓ Grid de anuncios: 2 columnas
- ✓ Navbar adaptada (posible menú hamburguesa)
- ✓ Formularios ocupan más ancho
- ✓ Imágenes en galería: tamaño medio
- ✓ Filtros apilados verticalmente

#### 7.3 Móvil (< 768px)

**Pasos**:
1. Usar DevTools en modo móvil (iPhone, Android)
2. Verificar todas las páginas

**Resultado Esperado**:
- ✓ Grid de anuncios: 1 columna
- ✓ Navbar con menú hamburguesa
- ✓ Formularios ocupan ancho completo
- ✓ Imágenes en galería: ancho completo
- ✓ Filtros en acordeón o modal
- ✓ Botones grandes (min 44x44px)
- ✓ Texto legible sin zoom
- ✓ Touch targets adecuados

#### 7.4 Orientación y Rotación

**Pasos**:
1. En móvil/tablet, rotar dispositivo
2. Verificar adaptación

**Resultado Esperado**:
- ✓ Layout se adapta a orientación
- ✓ No hay scroll horizontal
- ✓ Contenido visible sin cortes

---

### ✅ 8. Validar Acceso Público sin Autenticación

#### 8.1 Navegación Pública

**Pasos**:
1. Cerrar sesión (logout)
2. Navegar a página principal
3. Intentar acceder a diferentes secciones

**Resultado Esperado**:
- ✓ HomePage es accesible
- ✓ Lista de anuncios visible
- ✓ Vista detallada de anuncios accesible
- ✓ Filtros funcionan sin autenticación
- ✓ Búsqueda funciona sin autenticación
- ✓ Botones de compartir funcionan

#### 8.2 Rutas Protegidas

**Pasos**:
1. Sin autenticación, intentar acceder a:
   - `/create-listing`
   - `/my-listings`
   - `/profile`
   - `/interests`

**Resultado Esperado**:
- ✓ Redirección automática a `/login`
- ✓ Mensaje indicando que se requiere autenticación

#### 8.3 Botón de Interés

**Pasos**:
1. Sin autenticación, abrir anuncio
2. Verificar botón "Estoy Interesado"

**Resultado Esperado**:
- ✓ Botón visible pero indica "Inicia sesión para expresar interés"
- ✓ Click redirige a login
- ✓ Después de login, regresa al anuncio

---

## Pruebas Adicionales

### 9. Gestión de Perfil

**Pasos**:
1. Ir a "Mi Perfil"
2. Click en "Editar Perfil"
3. Modificar información (nombre, teléfono, ubicación)
4. Guardar cambios

**Resultado Esperado**:
- ✓ Cambios se guardan correctamente
- ✓ Información actualizada se refleja inmediatamente

### 10. Dar de Baja Cuenta

**Pasos**:
1. En perfil, click en "Dar de Baja Cuenta"
2. Confirmar en modal
3. Verificar resultado

**Resultado Esperado**:
- ✓ Modal de confirmación aparece
- ✓ Cuenta se desactiva/elimina
- ✓ Sesión se cierra automáticamente
- ✓ No se puede iniciar sesión con esa cuenta

### 11. Contador de Vistas

**Pasos**:
1. Abrir un anuncio
2. Refrescar página varias veces
3. Verificar contador

**Resultado Esperado**:
- ✓ Contador de vistas incrementa
- ✓ Número visible en vista detallada

### 12. Manejo de Errores

**Pasos**:
1. Detener backend
2. Intentar crear anuncio o hacer login
3. Verificar manejo de error

**Resultado Esperado**:
- ✓ Toast de error aparece
- ✓ Mensaje claro: "Error de conexión"
- ✓ No se rompe la aplicación

### 13. Loading States

**Pasos**:
1. En conexión lenta, realizar acciones
2. Verificar indicadores de carga

**Resultado Esperado**:
- ✓ Spinners/skeletons durante carga
- ✓ Botones deshabilitados durante submit
- ✓ Feedback visual claro

---

## Resumen de Validación

### Checklist Final

- [ ] ✅ Seed de estados y municipios ejecutado correctamente
- [ ] ✅ Registro de usuario funciona con todas las validaciones
- [ ] ✅ Login funciona correctamente
- [ ] ✅ Persistencia de sesión funciona
- [ ] ✅ Logout funciona correctamente
- [ ] ✅ Crear anuncio funciona con upload de imágenes
- [ ] ✅ Editar anuncio funciona correctamente
- [ ] ✅ Eliminar anuncio funciona con confirmación
- [ ] ✅ Filtro por estado funciona
- [ ] ✅ Filtro por municipio funciona
- [ ] ✅ Búsqueda por texto funciona
- [ ] ✅ Compartir en Facebook funciona
- [ ] ✅ Compartir en WhatsApp funciona
- [ ] ✅ Compartir en Twitter funciona
- [ ] ✅ Compartir por email funciona
- [ ] ✅ Copiar URL funciona
- [ ] ✅ Expresar interés funciona
- [ ] ✅ Ver intereses recibidos funciona
- [ ] ✅ Ver intereses enviados funciona
- [ ] ✅ Marcar como leído funciona
- [ ] ✅ Responsive desktop funciona
- [ ] ✅ Responsive tablet funciona
- [ ] ✅ Responsive móvil funciona
- [ ] ✅ Acceso público a anuncios funciona
- [ ] ✅ Rutas protegidas redirigen correctamente
- [ ] ✅ Gestión de perfil funciona
- [ ] ✅ Dar de baja cuenta funciona
- [ ] ✅ Contador de vistas funciona
- [ ] ✅ Manejo de errores funciona
- [ ] ✅ Loading states funcionan

---

## Notas Importantes

### Configuración de Email

Para probar completamente el envío de emails de notificación de interés:

1. Usar cuenta de Gmail con "App Password":
   - Ir a Google Account → Security → 2-Step Verification → App Passwords
   - Generar password para "Mail"
   - Usar en `EMAIL_PASS` en `.env`

2. O usar servicio de testing como Mailtrap:
   - Crear cuenta en mailtrap.io
   - Usar credenciales SMTP de Mailtrap
   - Verificar emails en inbox de Mailtrap

### Base de Datos

- Para testing limpio, ejecutar seed nuevamente: `node backend/scripts/seedMexico.js`
- Para limpiar usuarios y anuncios de prueba, usar MongoDB Compass o CLI

### Troubleshooting

**MongoDB no conecta**:
```bash
# Verificar si MongoDB está corriendo
ps aux | grep mongod

# Iniciar MongoDB (macOS con Homebrew)
brew services start mongodb-community

# O manualmente
mongod --config /usr/local/etc/mongod.conf
```

**Puerto en uso**:
```bash
# Verificar qué proceso usa el puerto
lsof -i :5000
lsof -i :3000

# Matar proceso si es necesario
kill -9 <PID>
```

**Dependencias faltantes**:
```bash
# Backend
cd backend && npm install

# Frontend
cd frontend && npm install
```

---

## Conclusión

Este checklist cubre todos los requisitos especificados en el documento de requirements.md y valida la funcionalidad completa de la aplicación SecondMarket.

Una vez completadas todas las validaciones, la aplicación está lista para:
- Despliegue en ambiente de staging
- Pruebas de usuario (UAT)
- Despliegue en producción

**Fecha de validación**: _____________
**Validado por**: _____________
**Resultado**: ☐ Aprobado ☐ Requiere correcciones
