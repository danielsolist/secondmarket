# API Routes Documentation

## Authentication Routes (`/api/auth`)

### POST /api/auth/register
Register a new user.

**Request Body:**
```json
{
  "email": "usuario@example.com",
  "password": "12345678",
  "nombre": "Juan Pérez",
  "telefono": "5512345678",
  "estado": "mongodb_object_id",
  "municipio": "mongodb_object_id"
}
```

**Success Response (201):**
```json
{
  "success": true,
  "data": {
    "token": "jwt_token_here",
    "user": {
      "_id": "user_id",
      "email": "usuario@example.com",
      "nombre": "Juan Pérez",
      "telefono": "5512345678",
      "estado": {
        "_id": "estado_id",
        "nombre": "Ciudad de México"
      },
      "municipio": {
        "_id": "municipio_id",
        "nombre": "Benito Juárez"
      },
      "activo": true,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  }
}
```

**Error Responses:**
- 400: Validation errors (invalid email, password not 8 characters, etc.)
- 409: Email already exists

---

### POST /api/auth/login
Login with existing credentials.

**Request Body:**
```json
{
  "email": "usuario@example.com",
  "password": "12345678"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "token": "jwt_token_here",
    "user": {
      "_id": "user_id",
      "email": "usuario@example.com",
      "nombre": "Juan Pérez",
      "telefono": "5512345678",
      "estado": {
        "_id": "estado_id",
        "nombre": "Ciudad de México"
      },
      "municipio": {
        "_id": "municipio_id",
        "nombre": "Benito Juárez"
      },
      "activo": true,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  }
}
```

**Error Responses:**
- 400: Validation errors
- 401: Invalid credentials or inactive account

---

### GET /api/auth/me
Get current authenticated user.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "user": {
      "_id": "user_id",
      "email": "usuario@example.com",
      "nombre": "Juan Pérez",
      "telefono": "5512345678",
      "estado": {
        "_id": "estado_id",
        "nombre": "Ciudad de México"
      },
      "municipio": {
        "_id": "municipio_id",
        "nombre": "Benito Juárez"
      },
      "activo": true,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  }
}
```

**Error Responses:**
- 401: No token provided, invalid token, or token expired
- 404: User not found

---

## Testing with cURL

### Register a new user:
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "12345678",
    "nombre": "Test User",
    "telefono": "5512345678",
    "estado": "ESTADO_ID_HERE",
    "municipio": "MUNICIPIO_ID_HERE"
  }'
```

### Login:
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "12345678"
  }'
```

### Get current user:
```bash
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

## Notes

- Password must be exactly 8 characters
- Email must be valid format
- Estado and Municipio must be valid MongoDB ObjectIds
- JWT token expires in 7 days (configurable via JWT_EXPIRE env variable)
- All passwords are hashed using bcrypt before storage
