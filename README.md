# SecondMarket 🛍️

Aplicación de compra-venta de productos de segunda mano para el mercado mexicano.

## Estado del Proyecto

✅ **PRODUCCIÓN LISTA** - Versión 1.0.1

- **Backend**: ✅ Verificado (20/20 checks)
- **Frontend**: ✅ Verificado (40/40 checks)
- **Build**: ✅ Exitoso (80 KB gzipped)
- **Bugs**: ✅ Todos corregidos (3/3)
- **Tareas**: ✅ Completadas (22/22)

Ver [FINAL_VERIFICATION_REPORT.md](FINAL_VERIFICATION_REPORT.md) para detalles completos.

## Características

- 📝 Registro simple con email y contraseña
- 📍 Catálogo completo de estados y municipios de México
- 📸 Publicación de anuncios con fotos y descripciones
- 🔍 Visualización pública de anuncios (sin necesidad de registro)
- 💬 Sistema de mensajería entre usuarios interesados
- 🔗 Compartir anuncios en redes sociales, email y URL
- ⚡ CRUD completo para usuarios y anuncios

## Tecnologías

- **Backend**: Node.js, Express, MongoDB, JWT
- **Frontend**: React, React Router, Axios
- **Notificaciones**: Nodemailer

## Estructura del Proyecto

```
secondmarket/
├── backend/           # API REST con Express
│   ├── models/       # Modelos de MongoDB
│   ├── routes/       # Rutas de la API
│   ├── middleware/   # Middleware de autenticación y validación
│   ├── services/     # Servicios (email, etc.)
│   └── scripts/      # Scripts de seed
├── frontend/         # Aplicación React
│   ├── src/
│   │   ├── components/  # Componentes reutilizables
│   │   ├── context/     # Context API (AuthContext)
│   │   ├── pages/       # Páginas de la aplicación
│   │   ├── services/    # Cliente API con Axios
│   │   └── utils/       # Funciones helper
│   └── public/
└── README.md
```

## Instalación

### Requisitos Previos
- Node.js v18+
- MongoDB v6+
- npm o yarn

### Backend
```bash
cd backend
npm install
cp .env.example .env
# Configurar variables de entorno en .env

# Cargar datos geográficos (32 estados y municipios)
npm run seed

# Verificar que todo esté configurado correctamente
node verify-backend.js

# Iniciar servidor
npm run dev
```

El backend estará disponible en `http://localhost:5000`

### Frontend
```bash
cd frontend
npm install
cp .env.example .env
# Configurar REACT_APP_API_URL en .env
npm start
```

El frontend estará disponible en `http://localhost:3000`

## Verificación

Antes de iniciar, puedes verificar que todo esté configurado correctamente:

### Verificar Backend
```bash
cd backend
node verify-backend.js
```

### Verificar Frontend
```bash
cd frontend
node verify-frontend.js
```

## Variables de Entorno

Ver `.env.example` en cada carpeta para configuración requerida.

## Documentación

- **[COMPLETE_VERIFICATION_SUMMARY.md](COMPLETE_VERIFICATION_SUMMARY.md)** - Resumen completo de verificación
- **[BACKEND_VERIFICATION_REPORT.md](BACKEND_VERIFICATION_REPORT.md)** - Reporte de verificación del backend
- **[FRONTEND_VERIFICATION_REPORT.md](FRONTEND_VERIFICATION_REPORT.md)** - Reporte de verificación del frontend
- **[TESTING_CHECKLIST.md](TESTING_CHECKLIST.md)** - Lista de verificación de pruebas manuales
- **[API_DOCUMENTATION.md](API_DOCUMENTATION.md)** - Documentación de la API
