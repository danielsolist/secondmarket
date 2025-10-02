# Middleware Documentation

## Overview
Este directorio contiene todos los middlewares de la aplicación SecondMarket.

## Estructura

```
middleware/
├── auth.js                 # Middleware de autenticación JWT
├── upload.js              # Middleware de upload de imágenes con Multer
├── errorHandler.js        # Middleware de manejo de errores global
├── index.js               # Exportación centralizada
└── validators/
    ├── userValidator.js       # Validaciones para User
    ├── listingValidator.js    # Validaciones para Listing
    └── interestValidator.js   # Validaciones para Interest
```

## Componentes Implementados

### 1. Authentication Middleware (auth.js)
**Propósito:** Verificar tokens JWT y proteger rutas

**Características:**
- Extrae token del header Authorization
- Verifica validez del token con JWT_SECRET
- Carga usuario desde la base de datos
- Verifica que el usuario esté activo
- Adjunta usuario al objeto request
- Maneja errores de token inválido/expirado

**Uso:**
```javascript
const { auth } = require('./middleware');
router.get('/protected', auth, controller);
```

### 2. Upload Middleware (upload.js)
**Propósito:** Manejar subida de imágenes con Multer

**Características:**
- Almacenamiento en sistema de archivos local
- Nombres únicos para archivos (timestamp + random)
- Filtro de tipos de archivo (JPG, PNG, WebP)
- Límite de tamaño: 5MB por archivo
- Límite de cantidad: 5 archivos máximo
- Manejo de errores de Multer

**Uso:**
```javascript
const { upload, handleMulterError } = require('./middleware');
router.post('/listing', 
  upload.array('imagenes', 5), 
  handleMulterError, 
  controller
);
```

### 3. Error Handler Middleware (errorHandler.js)
**Propósito:** Manejo centralizado de errores

**Características:**
- Captura todos los errores de la aplicación
- Formatea respuestas consistentes
- Maneja errores específicos:
  - ValidationError (Mongoose)
  - CastError (ID inválido)
  - Duplicate key (11000)
  - JWT errors
  - MulterError
- Incluye middleware notFound para rutas 404
- Clase AppError para errores personalizados

**Uso:**
```javascript
const { errorHandler, notFound, AppError } = require('./middleware');

// En server.js
app.use(notFound);
app.use(errorHandler);

// Para lanzar errores personalizados
throw new AppError('Mensaje', 404, 'NOT_FOUND');
```

### 4. User Validator (validators/userValidator.js)
**Propósito:** Validar datos de usuario

**Validaciones disponibles:**
- `validateRegister`: Email, contraseña (8 caracteres), estado, municipio
- `validateLogin`: Email y contraseña
- `validateUpdate`: Actualización de datos de usuario
- `validateUserId`: Validación de ID en parámetros

**Requisitos cumplidos:**
- Requirement 2.2: Contraseña de exactamente 8 caracteres
- Requirement 2.3: Email con formato válido
- Requirement 2.1: Validación de estado y municipio

### 5. Listing Validator (validators/listingValidator.js)
**Propósito:** Validar datos de anuncios

**Validaciones disponibles:**
- `validateCreateListing`: Título, descripción, precio, ubicación
- `validateUpdateListing`: Actualización de anuncio
- `validateListingId`: Validación de ID
- `validateUserIdParam`: Validación de ID de usuario
- `validateListingFilters`: Filtros de búsqueda

**Requisitos cumplidos:**
- Requirement 4.1: Validación de campos requeridos
- Requirement 4.2: Validación de múltiples imágenes (manejado por upload.js)
- Requirement 4.3: Validación de ubicación

### 6. Interest Validator (validators/interestValidator.js)
**Propósito:** Validar expresiones de interés

**Validaciones disponibles:**
- `validateCreateInterest`: Listing ID y mensaje opcional
- `validateInterestId`: Validación de ID
- `validateMarkAsRead`: Marcar como leído

## Formato de Respuesta de Error

Todos los errores siguen este formato consistente:

```json
{
  "success": false,
  "error": {
    "message": "Descripción del error",
    "code": "ERROR_CODE",
    "details": {}
  }
}
```

## Códigos de Error Comunes

- `NO_TOKEN`: No se proporcionó token
- `INVALID_TOKEN`: Token JWT inválido
- `TOKEN_EXPIRED`: Token expirado
- `USER_NOT_FOUND`: Usuario no encontrado
- `USER_INACTIVE`: Usuario inactivo
- `VALIDATION_ERROR`: Error de validación
- `FILE_TOO_LARGE`: Archivo excede 5MB
- `TOO_MANY_FILES`: Más de 5 archivos
- `UPLOAD_ERROR`: Error al subir archivo
- `DUPLICATE_ERROR`: Registro duplicado
- `NOT_FOUND`: Recurso no encontrado
- `SERVER_ERROR`: Error interno del servidor

## Variables de Entorno Requeridas

```env
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRE=7d
NODE_ENV=development|production
```

## Integración con Routes

Ejemplo de uso completo en una ruta:

```javascript
const express = require('express');
const router = express.Router();
const { 
  auth, 
  upload, 
  handleMulterError,
  listingValidator 
} = require('../middleware');

// Ruta protegida con validación y upload
router.post('/listings',
  auth,                                    // 1. Verificar autenticación
  upload.array('imagenes', 5),            // 2. Procesar imágenes
  handleMulterError,                       // 3. Manejar errores de upload
  listingValidator.validateCreateListing,  // 4. Validar datos
  listingController.create                 // 5. Ejecutar controlador
);
```

## Testing

Para probar los middlewares:

```bash
# Verificar que los módulos se importan correctamente
node -e "require('./middleware/index.js'); console.log('OK')"
```

## Notas de Implementación

1. **Seguridad**: Las contraseñas se validan pero no se hashean en el middleware (se hace en el modelo User)
2. **Uploads**: Las imágenes se guardan en `backend/uploads/` (crear directorio si no existe)
3. **JWT**: El token debe enviarse en el header: `Authorization: Bearer <token>`
4. **Validación**: Los errores de validación incluyen detalles específicos de cada campo
5. **Error Handling**: Debe ser el último middleware en la cadena de Express
