# Design Document - SecondMarket

## Overview

SecondMarket es una aplicación full-stack de marketplace para productos de segunda mano enfocada en el mercado mexicano. La arquitectura sigue un patrón cliente-servidor con:

- **Backend**: API RESTful construida con Node.js, Express y MongoDB
- **Frontend**: Aplicación React moderna con diseño responsivo
- **Base de datos**: MongoDB para almacenamiento de datos y relaciones
- **Almacenamiento**: Sistema de archivos local para imágenes (con posibilidad de migrar a cloud storage)

El sistema está diseñado para ser escalable, mantenible y proporcionar una experiencia de usuario fluida tanto para usuarios registrados como visitantes anónimos.

## Architecture

### High-Level Architecture

```
┌─────────────────┐         ┌─────────────────┐         ┌─────────────────┐
│                 │         │                 │         │                 │
│  React Frontend │◄───────►│  Express API    │◄───────►│    MongoDB      │
│                 │  HTTP   │                 │         │                 │
└─────────────────┘         └─────────────────┘         └─────────────────┘
                                    │
                                    │
                                    ▼
                            ┌─────────────────┐
                            │  File System    │
                            │  (Uploads)      │
                            └─────────────────┘
```

### Technology Stack

**Backend:**
- Node.js v18+
- Express.js 4.x
- MongoDB 6.x con Mongoose ODM
- JWT para autenticación
- Bcrypt para encriptación de contraseñas
- Multer para manejo de archivos
- Nodemailer para notificaciones por correo
- Express-validator para validación de datos

**Frontend:**
- React 18+
- React Router para navegación
- Axios para peticiones HTTP
- Context API o Redux para estado global
- CSS Modules o Styled Components para estilos
- React Share para compartir en redes sociales

**Infraestructura:**
- CORS habilitado para comunicación frontend-backend
- Variables de entorno para configuración
- Estructura de carpetas modular

## Components and Interfaces

### Backend Components

#### 1. Models (Mongoose Schemas)

**Estado Model**
```javascript
{
  nombre: String (required, unique),
  codigo: String (required, unique),
  timestamps: true
}
```

**Municipio Model**
```javascript
{
  nombre: String (required),
  estado: ObjectId (ref: Estado, required),
  timestamps: true,
  index: { nombre, estado } (unique)
}
```

**User Model**
```javascript
{
  email: String (required, unique, lowercase, trim),
  password: String (required, minlength: 8, hashed),
  nombre: String,
  telefono: String,
  estado: ObjectId (ref: Estado, required),
  municipio: ObjectId (ref: Municipio, required),
  activo: Boolean (default: true),
  timestamps: true
}
```

**Listing Model (Anuncio)**
```javascript
{
  titulo: String (required, maxlength: 100),
  descripcion: String (required, maxlength: 1000),
  precio: Number (required, min: 0),
  imagenes: [String] (array de URLs, min: 1, max: 5),
  usuario: ObjectId (ref: User, required),
  estado: ObjectId (ref: Estado, required),
  municipio: ObjectId (ref: Municipio, required),
  activo: Boolean (default: true),
  vistas: Number (default: 0),
  timestamps: true
}
```

**Interest Model (Interés)**
```javascript
{
  listing: ObjectId (ref: Listing, required),
  usuarioInteresado: ObjectId (ref: User, required),
  vendedor: ObjectId (ref: User, required),
  mensaje: String,
  leido: Boolean (default: false),
  timestamps: true,
  index: { listing, usuarioInteresado } (unique)
}
```

#### 2. API Routes

**Authentication Routes** (`/api/auth`)
- `POST /register` - Registro de nuevo usuario
- `POST /login` - Inicio de sesión
- `GET /me` - Obtener usuario actual (protegida)

**User Routes** (`/api/users`)
- `GET /:id` - Obtener perfil de usuario (protegida)
- `PUT /:id` - Actualizar usuario (protegida)
- `DELETE /:id` - Dar de baja usuario (protegida)

**Location Routes** (`/api/locations`)
- `GET /estados` - Listar todos los estados
- `GET /estados/:id/municipios` - Listar municipios por estado
- `GET /municipios/:id` - Obtener municipio específico

**Listing Routes** (`/api/listings`)
- `GET /` - Listar todos los anuncios (pública, con filtros)
- `GET /:id` - Obtener anuncio específico (pública)
- `POST /` - Crear anuncio (protegida)
- `PUT /:id` - Actualizar anuncio (protegida)
- `DELETE /:id` - Eliminar anuncio (protegida)
- `GET /user/:userId` - Listar anuncios de un usuario (protegida)

**Interest Routes** (`/api/interests`)
- `POST /` - Expresar interés en un anuncio (protegida)
- `GET /received` - Obtener intereses recibidos (protegida)
- `GET /sent` - Obtener intereses enviados (protegida)
- `PUT /:id/read` - Marcar interés como leído (protegida)

#### 3. Middleware

**Authentication Middleware** (`auth.js`)
- Verifica JWT token en headers
- Adjunta usuario al request
- Retorna 401 si no autenticado

**Upload Middleware** (`upload.js`)
- Configura Multer para subida de imágenes
- Valida tipo de archivo (jpg, png, webp)
- Limita tamaño de archivo (5MB por imagen)
- Genera nombres únicos para archivos

**Validation Middleware** (`validators/`)
- Valida datos de entrada usando express-validator
- Sanitiza inputs para prevenir inyecciones
- Retorna errores de validación estructurados

**Error Handler Middleware** (`errorHandler.js`)
- Captura errores de toda la aplicación
- Formatea respuestas de error consistentes
- Registra errores en logs

#### 4. Services

**Email Service** (`services/emailService.js`)
- Envía notificaciones de interés
- Configura templates de correo
- Maneja errores de envío

**Image Service** (`services/imageService.js`)
- Procesa y optimiza imágenes
- Genera thumbnails
- Elimina imágenes huérfanas

### Frontend Components

#### 1. Pages

**HomePage**
- Lista de anuncios con grid responsivo
- Filtros por estado y municipio
- Búsqueda por texto
- Accesible sin autenticación

**ListingDetailPage**
- Vista detallada del anuncio
- Galería de imágenes
- Información del vendedor
- Botón de interés (si está autenticado)
- Opciones de compartir

**RegisterPage**
- Formulario de registro
- Validación en tiempo real
- Selección de estado y municipio

**LoginPage**
- Formulario de inicio de sesión
- Enlace a registro

**ProfilePage**
- Información del usuario
- Edición de perfil
- Opción de dar de baja cuenta

**MyListingsPage**
- Lista de anuncios del usuario
- Opciones de editar/eliminar
- Botón para crear nuevo anuncio

**CreateListingPage**
- Formulario de creación de anuncio
- Upload de múltiples imágenes
- Preview de imágenes
- Selección de ubicación

**EditListingPage**
- Similar a CreateListingPage
- Pre-cargado con datos existentes

**InterestsPage**
- Lista de intereses recibidos
- Información de contacto de interesados
- Marcar como leído

#### 2. Components

**Navbar**
- Logo de SecondMarket
- Enlaces de navegación
- Botones de login/registro o perfil
- Responsivo con menú hamburguesa

**ListingCard**
- Imagen principal
- Título y precio
- Ubicación
- Fecha de publicación

**FilterBar**
- Selectores de estado y municipio
- Búsqueda por texto
- Botón de limpiar filtros

**ImageGallery**
- Carrusel de imágenes
- Thumbnails
- Zoom en click

**ShareButtons**
- Botones de redes sociales (Facebook, WhatsApp, Twitter)
- Botón de compartir por correo
- Botón de copiar URL

**InterestButton**
- Botón para expresar interés
- Modal de confirmación con mensaje opcional
- Feedback visual

**ProtectedRoute**
- HOC para rutas protegidas
- Redirige a login si no autenticado

**LocationSelector**
- Selector de estado
- Selector de municipio (filtrado por estado)
- Carga dinámica de municipios

#### 3. Context/State Management

**AuthContext**
- Estado de autenticación
- Usuario actual
- Funciones de login/logout/register
- Token JWT

**ListingsContext** (opcional)
- Cache de anuncios
- Filtros activos
- Paginación

## Data Models

### Entity Relationship Diagram

```
┌─────────────┐         ┌─────────────┐         ┌─────────────┐
│   Estado    │         │  Municipio  │         │    User     │
├─────────────┤         ├─────────────┤         ├─────────────┤
│ _id         │◄───────┤ _id         │         │ _id         │
│ nombre      │    1    │ nombre      │    1    │ email       │
│ codigo      │         │ estado (FK) │◄───────┤ password    │
└─────────────┘         └─────────────┘    *    │ nombre      │
      ▲                       ▲                  │ telefono    │
      │                       │                  │ estado (FK) │
      │                       │                  │ municipio   │
      │                       │                  │ activo      │
      │                       │                  └─────────────┘
      │                       │                        │
      │                       │                        │ 1
      │                       │                        │
      │                       │                        ▼
      │                       │                  ┌─────────────┐
      │                       │                  │   Listing   │
      │                       │                  ├─────────────┤
      │                       └─────────────────┤ _id         │
      │                              *          │ titulo      │
      └─────────────────────────────────────────┤ descripcion │
                                     *          │ precio      │
                                                │ imagenes[]  │
                                                │ usuario (FK)│
                                                │ estado (FK) │
                                                │ municipio   │
                                                │ activo      │
                                                │ vistas      │
                                                └─────────────┘
                                                      │
                                                      │ 1
                                                      │
                                                      ▼
                                                ┌─────────────┐
                                                │  Interest   │
                                                ├─────────────┤
                                                │ _id         │
                                                │ listing (FK)│
                                                │ usuario (FK)│
                                                │ vendedor    │
                                                │ mensaje     │
                                                │ leido       │
                                                └─────────────┘
```

### Data Flow Examples

**Crear Anuncio:**
1. Usuario autenticado envía POST a `/api/listings`
2. Middleware valida token JWT
3. Multer procesa imágenes
4. Validator valida datos del anuncio
5. Controller crea documento Listing
6. Retorna anuncio creado con status 201

**Expresar Interés:**
1. Usuario autenticado hace POST a `/api/interests`
2. Sistema crea documento Interest
3. Sistema obtiene email del vendedor
4. EmailService envía notificación
5. Retorna confirmación

**Filtrar Anuncios:**
1. Cliente hace GET a `/api/listings?estado=X&municipio=Y`
2. Controller construye query de MongoDB
3. Ejecuta query con populate de referencias
4. Retorna array de anuncios

## Error Handling

### Error Response Format

Todas las respuestas de error seguirán este formato:

```javascript
{
  success: false,
  error: {
    message: "Descripción del error",
    code: "ERROR_CODE",
    details: {} // Opcional, para errores de validación
  }
}
```

### Error Types

**Validation Errors (400)**
- Datos de entrada inválidos
- Formato de email incorrecto
- Contraseña no cumple requisitos
- Campos requeridos faltantes

**Authentication Errors (401)**
- Token JWT inválido o expirado
- Credenciales incorrectas
- Usuario no autenticado

**Authorization Errors (403)**
- Usuario intenta editar anuncio de otro
- Usuario intenta eliminar cuenta de otro

**Not Found Errors (404)**
- Recurso no existe
- Anuncio no encontrado
- Usuario no encontrado

**Conflict Errors (409)**
- Email ya registrado
- Interés duplicado en mismo anuncio

**Server Errors (500)**
- Error de base de datos
- Error al procesar imágenes
- Error al enviar email

### Frontend Error Handling

- Toast notifications para errores
- Mensajes de error inline en formularios
- Página 404 personalizada
- Fallback UI para errores de carga
- Retry logic para peticiones fallidas

## Testing Strategy

### Backend Testing

**Unit Tests**
- Modelos: Validaciones y métodos
- Services: Lógica de negocio aislada
- Utilities: Funciones helper

**Integration Tests**
- Routes: Endpoints completos
- Middleware: Autenticación y validación
- Database: Operaciones CRUD

**Test Tools**
- Jest como test runner
- Supertest para testing de API
- MongoDB Memory Server para tests de DB

**Coverage Goals**
- Mínimo 70% de cobertura
- 100% en rutas críticas (auth, payments)

### Frontend Testing

**Unit Tests**
- Components: Renderizado y props
- Hooks: Lógica de estado
- Utils: Funciones helper

**Integration Tests**
- Flujos de usuario completos
- Interacción entre componentes
- Context providers

**E2E Tests** (Opcional)
- Flujo de registro y login
- Crear y publicar anuncio
- Expresar interés en anuncio

**Test Tools**
- Jest + React Testing Library
- Cypress o Playwright para E2E

### Manual Testing Checklist

- [ ] Registro con diferentes escenarios
- [ ] Login y logout
- [ ] Crear anuncio con múltiples imágenes
- [ ] Editar y eliminar anuncios propios
- [ ] Filtrar por estado y municipio
- [ ] Compartir en redes sociales
- [ ] Expresar interés (envío de email)
- [ ] Responsive en móvil, tablet y desktop
- [ ] Navegación sin autenticación
- [ ] Dar de baja cuenta

## Security Considerations

### Authentication & Authorization

- Contraseñas hasheadas con bcrypt (salt rounds: 10)
- JWT tokens con expiración de 7 días
- Refresh tokens para sesiones largas (opcional)
- Verificación de propiedad en operaciones CRUD

### Input Validation

- Sanitización de todos los inputs
- Validación de tipos de archivo
- Límites de tamaño de archivo
- Escape de HTML en descripciones
- Validación de formato de email

### API Security

- Rate limiting para prevenir abuse
- CORS configurado apropiadamente
- Headers de seguridad (Helmet.js)
- HTTPS en producción
- Variables de entorno para secretos

### Data Protection

- No exponer contraseñas en responses
- No exponer información sensible de usuarios
- Validar permisos antes de operaciones
- Logs sin información sensible

## Performance Optimization

### Backend

- Índices en MongoDB para queries frecuentes
- Paginación en listados de anuncios
- Caching de catálogos (estados/municipios)
- Compresión de responses (gzip)
- Lazy loading de relaciones

### Frontend

- Code splitting por rutas
- Lazy loading de imágenes
- Optimización de imágenes (WebP)
- Memoización de componentes pesados
- Debouncing en búsquedas

### Database

- Índices compuestos para filtros comunes
- Proyecciones para limitar datos retornados
- Aggregation pipelines para queries complejas

## Deployment Considerations

### Environment Variables

```
# Backend
PORT=5000
MONGODB_URI=mongodb://localhost:27017/secondmarket
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRE=7d
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_password
FRONTEND_URL=http://localhost:3000

# Frontend
REACT_APP_API_URL=http://localhost:5000/api
```

### Production Checklist

- [ ] Variables de entorno configuradas
- [ ] Base de datos con datos de estados/municipios
- [ ] HTTPS habilitado
- [ ] CORS configurado para dominio de producción
- [ ] Logs configurados
- [ ] Backups de base de datos
- [ ] Monitoreo de errores (Sentry)
- [ ] CDN para imágenes (opcional)

## UI/UX Design Guidelines

### Color Palette (Sugerida para público joven)

- **Primary**: #6366F1 (Indigo vibrante)
- **Secondary**: #EC4899 (Pink moderno)
- **Success**: #10B981 (Green)
- **Warning**: #F59E0B (Amber)
- **Error**: #EF4444 (Red)
- **Neutral**: #6B7280 (Gray)
- **Background**: #F9FAFB (Light gray)

### Typography

- **Headings**: Inter, Poppins o Montserrat (bold)
- **Body**: Inter o System fonts
- **Sizes**: Sistema de escala modular (16px base)

### Layout Principles

- Grid responsivo (12 columnas)
- Espaciado consistente (8px base)
- Cards con sombras sutiles
- Bordes redondeados (8-12px)
- Animaciones suaves (200-300ms)

### Mobile-First Approach

- Diseño inicial para móvil
- Breakpoints: 640px, 768px, 1024px, 1280px
- Touch targets mínimo 44x44px
- Navegación accesible con pulgar

### Accessibility

- Contraste WCAG AA mínimo
- Labels en todos los inputs
- Alt text en imágenes
- Navegación por teclado
- ARIA labels donde sea necesario

## Future Enhancements

### Phase 2 Features

- Sistema de mensajería interna
- Ratings y reviews de usuarios
- Categorías de productos
- Búsqueda avanzada con filtros múltiples
- Favoritos/Wishlist
- Notificaciones push

### Phase 3 Features

- Sistema de pagos integrado
- Verificación de usuarios
- Promoción de anuncios (destacados)
- Analytics para vendedores
- App móvil nativa
- Chat en tiempo real

### Scalability Considerations

- Migrar imágenes a S3 o Cloudinary
- Implementar CDN
- Cache con Redis
- Microservicios para funcionalidades específicas
- Load balancing
- Database sharding por región
