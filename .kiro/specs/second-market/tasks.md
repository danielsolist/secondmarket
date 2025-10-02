# Implementation Plan - SecondMarket

- [x] 1. Completar modelos de base de datos y configuración inicial
  - Completar el modelo User.js que está incompleto
  - Crear modelo Listing.js para anuncios
  - Crear modelo Interest.js para expresiones de interés
  - Crear script de seed para cargar estados y municipios de México
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 2.1, 2.2, 2.3, 2.4, 2.5, 2.6_

- [x] 2. Implementar middleware de autenticación y validación
  - Crear middleware de autenticación JWT (auth.js)
  - Crear middleware de upload de imágenes con Multer (upload.js)
  - Crear validators para User, Listing e Interest
  - Crear middleware de manejo de errores global
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 4.1, 4.2_

- [x] 3. Implementar rutas de autenticación
  - Crear POST /api/auth/register con validación de email y contraseña de 8 caracteres
  - Crear POST /api/auth/login con generación de JWT
  - Crear GET /api/auth/me para obtener usuario autenticado
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6_

- [x] 4. Implementar rutas de gestión de usuarios (CRUD)
  - Crear GET /api/users/:id para obtener perfil
  - Crear PUT /api/users/:id para actualizar usuario con validaciones
  - Crear DELETE /api/users/:id para dar de baja cuenta
  - Implementar verificación de propiedad (usuario solo puede modificar su propia cuenta)
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6_

- [x] 5. Implementar rutas de ubicaciones geográficas
  - Crear GET /api/locations/estados para listar todos los estados
  - Crear GET /api/locations/estados/:id/municipios para listar municipios por estado
  - Crear GET /api/locations/municipios/:id para obtener municipio específico
  - _Requirements: 1.1, 1.2, 1.3_

- [x] 6. Implementar rutas de anuncios (Listings) - Parte 1: Lectura pública
  - Crear GET /api/listings para listar todos los anuncios con filtros de estado y municipio
  - Crear GET /api/listings/:id para obtener anuncio específico con populate de referencias
  - Implementar contador de vistas en anuncios
  - Estas rutas deben ser públicas (sin autenticación requerida)
  - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 10.1, 10.2, 10.3, 10.4, 10.5, 10.6_

- [x] 7. Implementar rutas de anuncios (Listings) - Parte 2: Operaciones protegidas
  - Crear POST /api/listings para crear anuncio con upload de múltiples imágenes
  - Crear PUT /api/listings/:id para actualizar anuncio
  - Crear DELETE /api/listings/:id para eliminar anuncio
  - Crear GET /api/listings/user/:userId para listar anuncios de un usuario
  - Implementar verificación de propiedad (usuario solo puede modificar sus anuncios)
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7, 5.1, 5.2, 5.3, 5.4, 5.5, 5.6_

- [x] 8. Implementar sistema de intereses y notificaciones
  - Crear servicio de email (emailService.js) con Nodemailer
  - Crear POST /api/interests para expresar interés en anuncio
  - Crear GET /api/interests/received para obtener intereses recibidos
  - Crear GET /api/interests/sent para obtener intereses enviados
  - Crear PUT /api/interests/:id/read para marcar como leído
  - Implementar envío de email al vendedor cuando alguien expresa interés
  - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5, 8.6_

- [x] 9. Configurar estructura del proyecto frontend React
  - Crear aplicación React con estructura de carpetas (pages, components, context, services, utils)
  - Configurar React Router con rutas principales
  - Crear servicio API (axios) con interceptores para JWT
  - Crear AuthContext para manejo de autenticación global
  - Configurar variables de entorno para URL del backend
  - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5, 9.6_

- [x] 10. Implementar componentes de autenticación en frontend
  - Crear página de registro (RegisterPage) con formulario y validación
  - Crear página de login (LoginPage) con formulario
  - Crear componente ProtectedRoute para rutas protegidas
  - Implementar lógica de AuthContext (login, logout, register, persistencia de token)
  - Crear componente Navbar con enlaces condicionales según autenticación
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6_

- [x] 11. Implementar selector de ubicación geográfica
  - Crear componente LocationSelector con selectores de estado y municipio
  - Implementar carga dinámica de municipios al seleccionar estado
  - Integrar LocationSelector en RegisterPage y CreateListingPage
  - _Requirements: 1.1, 1.2, 1.3, 4.3_

- [x] 12. Implementar página principal y listado de anuncios
  - Crear HomePage con grid de anuncios
  - Crear componente ListingCard para mostrar anuncio resumido
  - Crear componente FilterBar con filtros de estado, municipio y búsqueda
  - Implementar lógica de filtrado y búsqueda
  - Hacer la página accesible sin autenticación
  - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 10.1, 10.2, 10.3, 10.4, 10.5, 10.6_

- [x] 13. Implementar vista detallada de anuncio
  - Crear ListingDetailPage con toda la información del anuncio
  - Crear componente ImageGallery con carrusel de imágenes
  - Crear componente ShareButtons con botones de redes sociales y copiar URL
  - Crear componente InterestButton para expresar interés (solo usuarios autenticados)
  - Implementar contador de vistas
  - _Requirements: 6.1, 6.2, 6.3, 6.4, 7.1, 7.2, 7.3, 7.4, 7.5, 7.6, 8.1, 8.2_

- [x] 14. Implementar gestión de anuncios del usuario
  - Crear MyListingsPage con lista de anuncios del usuario
  - Crear CreateListingPage con formulario de creación y upload de imágenes
  - Crear EditListingPage con formulario pre-cargado
  - Implementar preview de imágenes antes de subir
  - Implementar opciones de editar y eliminar en MyListingsPage
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7, 5.1, 5.2, 5.3, 5.4, 5.5, 5.6_

- [x] 15. Implementar gestión de perfil de usuario
  - Crear ProfilePage con información del usuario
  - Implementar formulario de edición de perfil
  - Implementar opción de dar de baja cuenta con confirmación
  - Crear InterestsPage para ver intereses recibidos y enviados
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 8.3, 8.4_

- [x] 16. Implementar estilos y diseño responsivo
  - Aplicar paleta de colores moderna (indigo, pink) en toda la aplicación
  - Implementar diseño mobile-first con breakpoints responsivos
  - Crear componentes con cards, sombras y bordes redondeados
  - Implementar animaciones suaves en transiciones
  - Asegurar touch targets de mínimo 44x44px en móvil
  - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5, 9.6_

- [x] 17. Implementar manejo de errores y feedback visual
  - Crear componente Toast para notificaciones
  - Implementar mensajes de error inline en formularios
  - Crear página 404 personalizada
  - Implementar loading states en todas las peticiones
  - Implementar confirmaciones visuales para acciones exitosas
  - _Requirements: 9.2, 9.3, 9.6_

- [x] 18. Configurar variables de entorno y documentación
  - Actualizar archivo .env.example con todas las variables necesarias
  - Crear archivo README.md con instrucciones de instalación y ejecución
  - Documentar endpoints de API
  - Crear guía de despliegue
  - _Requirements: Todos_

- [x] 19. Testing y validación final
  - Ejecutar seed de estados y municipios
  - Probar flujo completo de registro y login
  - Probar creación, edición y eliminación de anuncios
  - Probar filtrado por ubicación
  - Probar compartir en redes sociales
  - Probar expresión de interés y envío de emails
  - Validar responsive en móvil, tablet y desktop
  - Validar acceso público a anuncios sin autenticación
  - _Requirements: Todos_

- [x] 20. Corrección de bug en ruta de intereses
  - Corregir importación del middleware auth en backend/routes/interests.js
  - Verificar que todas las rutas carguen correctamente
  - Ejecutar script de verificación del backend
  - _Requirements: 8.1, 8.2, 8.3, 8.4_

- [x] 21. Verificación completa del frontend
  - Crear script de verificación del frontend
  - Verificar todas las páginas y componentes
  - Validar configuración y dependencias
  - Generar reporte de verificación
  - _Requirements: Todos_

- [x] 22. Corrección de errores de compilación del frontend
  - Corregir importaciones de AuthContext (usar useAuth hook)
  - Agregar variables de estado faltantes (success, error, serverError, successMessage)
  - Verificar que el build de producción funcione correctamente
  - _Requirements: Todos_
