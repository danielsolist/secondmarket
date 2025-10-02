# SecondMarket Frontend

Frontend de la aplicación SecondMarket construido con React.

## Estructura del Proyecto

```
frontend/
├── public/
│   └── index.html
├── src/
│   ├── components/       # Componentes reutilizables
│   │   ├── Navbar.js
│   │   └── ProtectedRoute.js
│   ├── context/          # Context API para estado global
│   │   └── AuthContext.js
│   ├── pages/            # Páginas de la aplicación
│   │   ├── HomePage.js
│   │   ├── LoginPage.js
│   │   ├── RegisterPage.js
│   │   ├── ProfilePage.js
│   │   ├── MyListingsPage.js
│   │   ├── CreateListingPage.js
│   │   ├── EditListingPage.js
│   │   ├── ListingDetailPage.js
│   │   ├── InterestsPage.js
│   │   └── NotFoundPage.js
│   ├── services/         # Servicios de API
│   │   └── api.js
│   ├── App.js
│   ├── App.css
│   ├── index.js
│   └── index.css
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

## Configuración

1. Instalar dependencias:
```bash
npm install
```

2. Crear archivo `.env` basado en `.env.example`:
```bash
cp .env.example .env
```

3. Configurar la URL del backend en `.env`:
```
REACT_APP_API_URL=http://localhost:5000/api
```

## Scripts Disponibles

### `npm start`
Ejecuta la aplicación en modo desarrollo.
Abre [http://localhost:3000](http://localhost:3000) en el navegador.

### `npm run build`
Construye la aplicación para producción en la carpeta `build`.

### `npm test`
Ejecuta los tests.

## Características Implementadas

### Autenticación
- Context API para manejo de autenticación global
- Persistencia de sesión con localStorage
- Interceptores de Axios para JWT
- Rutas protegidas

### Navegación
- React Router con rutas públicas y protegidas
- Navbar con enlaces condicionales según autenticación
- Página 404 personalizada

### Servicios
- Cliente Axios configurado con interceptores
- Manejo automático de tokens JWT
- Redirección automática en caso de token expirado

## Próximos Pasos

Las siguientes tareas implementarán:
- Formularios de autenticación (login/registro)
- Selector de ubicación geográfica
- Listado y filtrado de anuncios
- Vista detallada de anuncios
- Gestión de anuncios del usuario
- Sistema de intereses
- Estilos y diseño responsivo completo
