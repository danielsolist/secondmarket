# Requirements Document

## Introduction

SecondMarket es una aplicación de compra-venta de productos de segunda mano diseñada específicamente para el mercado mexicano. La plataforma permite a los usuarios publicar anuncios de artículos usados con fotos y descripciones, mientras que cualquier persona (registrada o no) puede visualizar los productos disponibles. El sistema incluye catálogos completos de estados y municipios de México para facilitar la ubicación geográfica de usuarios y anuncios. La aplicación está orientada a un público joven con una interfaz moderna y simple, e incluye funcionalidades de compartir en redes sociales y notificaciones de interés entre usuarios.

## Requirements

### Requirement 1: Gestión de Catálogos Geográficos

**User Story:** Como administrador del sistema, quiero tener catálogos completos de estados y municipios de México en la base de datos, para que los usuarios puedan seleccionar su ubicación de manera precisa.

#### Acceptance Criteria

1. WHEN el sistema se inicializa THEN SHALL cargar todos los 32 estados de México en la base de datos
2. WHEN el sistema se inicializa THEN SHALL cargar todos los municipios de México asociados a sus respectivos estados
3. WHEN un usuario selecciona un estado THEN el sistema SHALL mostrar únicamente los municipios correspondientes a ese estado
4. IF la base de datos no contiene los catálogos THEN el sistema SHALL proporcionar un mecanismo de carga inicial de datos

### Requirement 2: Registro y Autenticación de Usuarios

**User Story:** Como usuario nuevo, quiero registrarme en la aplicación con mi correo electrónico y contraseña, para poder publicar anuncios y contactar vendedores.

#### Acceptance Criteria

1. WHEN un usuario accede al registro THEN el sistema SHALL solicitar correo electrónico, contraseña, estado y municipio
2. WHEN un usuario ingresa una contraseña THEN el sistema SHALL validar que tenga exactamente 8 caracteres
3. WHEN un usuario ingresa un correo electrónico THEN el sistema SHALL validar que tenga formato válido
4. WHEN un usuario completa el registro THEN el sistema SHALL almacenar la contraseña de forma segura (encriptada)
5. WHEN un usuario intenta registrarse con un correo ya existente THEN el sistema SHALL mostrar un mensaje de error
6. WHEN un usuario se registra exitosamente THEN el sistema SHALL permitir el acceso inmediato a la aplicación

### Requirement 3: Gestión de Usuarios (CRUD)

**User Story:** Como usuario registrado, quiero poder actualizar mi información personal o dar de baja mi cuenta, para mantener control sobre mis datos.

#### Acceptance Criteria

1. WHEN un usuario está autenticado THEN el sistema SHALL permitir visualizar su perfil completo
2. WHEN un usuario modifica su información THEN el sistema SHALL permitir actualizar correo, contraseña, estado y municipio
3. WHEN un usuario solicita dar de baja su cuenta THEN el sistema SHALL solicitar confirmación antes de proceder
4. WHEN un usuario confirma la baja THEN el sistema SHALL desactivar o eliminar la cuenta y sus datos asociados
5. WHEN un usuario actualiza su contraseña THEN el sistema SHALL validar que tenga 8 caracteres
6. WHEN un usuario da de baja su cuenta THEN el sistema SHALL gestionar apropiadamente sus anuncios publicados

### Requirement 4: Publicación de Anuncios

**User Story:** Como usuario registrado, quiero publicar anuncios de artículos de segunda mano con fotos y descripción, para vender mis productos.

#### Acceptance Criteria

1. WHEN un usuario crea un anuncio THEN el sistema SHALL solicitar título, descripción, precio, estado, municipio y al menos una foto
2. WHEN un usuario sube fotos THEN el sistema SHALL permitir múltiples imágenes por anuncio
3. WHEN un usuario selecciona ubicación THEN el sistema SHALL solicitar estado y municipio del artículo
4. WHEN un usuario publica un anuncio THEN el sistema SHALL almacenar la fecha de publicación
5. WHEN un usuario publica un anuncio THEN el sistema SHALL asociar el anuncio con el usuario creador
6. WHEN un usuario completa la publicación THEN el sistema SHALL hacer visible el anuncio inmediatamente
7. IF un usuario no está autenticado THEN el sistema SHALL impedir la creación de anuncios

### Requirement 5: Gestión de Anuncios (CRUD)

**User Story:** Como usuario registrado, quiero poder editar o eliminar mis anuncios publicados, para mantener actualizada mi información de venta.

#### Acceptance Criteria

1. WHEN un usuario visualiza sus anuncios THEN el sistema SHALL mostrar opciones de editar y eliminar
2. WHEN un usuario edita un anuncio THEN el sistema SHALL permitir modificar título, descripción, precio, ubicación y fotos
3. WHEN un usuario elimina un anuncio THEN el sistema SHALL solicitar confirmación antes de proceder
4. WHEN un usuario confirma la eliminación THEN el sistema SHALL remover el anuncio de la plataforma
5. WHEN un usuario intenta editar un anuncio THEN el sistema SHALL verificar que sea el propietario
6. WHEN un usuario intenta eliminar un anuncio THEN el sistema SHALL verificar que sea el propietario

### Requirement 6: Visualización Pública de Anuncios

**User Story:** Como visitante no registrado, quiero ver todos los anuncios publicados, para buscar productos de mi interés sin necesidad de crear una cuenta.

#### Acceptance Criteria

1. WHEN cualquier persona accede a la aplicación THEN el sistema SHALL mostrar todos los anuncios activos
2. WHEN se visualiza un anuncio THEN el sistema SHALL mostrar título, descripción, precio, fotos, ubicación (estado y municipio) y fecha de publicación
3. WHEN se listan anuncios THEN el sistema SHALL mostrar información resumida de cada anuncio
4. WHEN un visitante hace clic en un anuncio THEN el sistema SHALL mostrar la vista detallada completa
5. IF un usuario no está registrado THEN el sistema SHALL permitir navegación y visualización sin restricciones

### Requirement 7: Funcionalidad de Compartir Anuncios

**User Story:** Como usuario (registrado o no), quiero compartir anuncios en redes sociales, por correo o copiar el enlace, para difundir productos interesantes.

#### Acceptance Criteria

1. WHEN un usuario visualiza un anuncio THEN el sistema SHALL mostrar opciones de compartir
2. WHEN un usuario selecciona compartir en redes sociales THEN el sistema SHALL proporcionar botones para plataformas populares (Facebook, WhatsApp, Twitter)
3. WHEN un usuario selecciona compartir por correo THEN el sistema SHALL abrir el cliente de correo con el enlace del anuncio
4. WHEN un usuario selecciona copiar URL THEN el sistema SHALL copiar el enlace al portapapeles
5. WHEN un usuario copia el enlace THEN el sistema SHALL mostrar confirmación visual
6. WHEN se comparte un anuncio THEN el enlace SHALL dirigir directamente a la vista detallada del anuncio

### Requirement 8: Sistema de Notificaciones de Interés

**User Story:** Como vendedor, quiero recibir notificaciones cuando alguien está interesado en mi artículo, para poder contactar con potenciales compradores.

#### Acceptance Criteria

1. WHEN un usuario registrado visualiza un anuncio de otro usuario THEN el sistema SHALL mostrar un botón de "Estoy interesado" o similar
2. WHEN un usuario expresa interés en un anuncio THEN el sistema SHALL enviar una notificación al vendedor
3. WHEN se envía una notificación THEN el sistema SHALL incluir información del usuario interesado y el artículo
4. WHEN un vendedor recibe una notificación THEN el sistema SHALL proporcionar medio de contacto del interesado
5. IF un usuario no está registrado THEN el sistema SHALL solicitar registro antes de expresar interés
6. WHEN un usuario expresa interés THEN el sistema SHALL registrar la acción para evitar duplicados

### Requirement 9: Interfaz de Usuario Moderna y Simple

**User Story:** Como usuario joven, quiero una interfaz moderna, simple e intuitiva, para navegar fácilmente por la aplicación.

#### Acceptance Criteria

1. WHEN un usuario accede a la aplicación THEN el sistema SHALL presentar un diseño limpio y minimalista
2. WHEN un usuario navega THEN el sistema SHALL utilizar una paleta de colores moderna y atractiva para público joven
3. WHEN un usuario interactúa THEN el sistema SHALL proporcionar feedback visual inmediato
4. WHEN se visualiza en dispositivos móviles THEN el sistema SHALL adaptar el diseño responsivamente
5. WHEN se cargan imágenes THEN el sistema SHALL optimizar la visualización sin comprometer la experiencia
6. WHEN un usuario realiza acciones THEN el sistema SHALL mantener la navegación intuitiva con máximo 3 clics para cualquier función

### Requirement 10: Filtrado y Búsqueda de Anuncios

**User Story:** Como usuario, quiero filtrar anuncios por ubicación (estado y municipio), para encontrar productos cerca de mi zona.

#### Acceptance Criteria

1. WHEN un usuario accede a la lista de anuncios THEN el sistema SHALL proporcionar filtros de estado y municipio
2. WHEN un usuario selecciona un estado THEN el sistema SHALL mostrar solo anuncios de ese estado
3. WHEN un usuario selecciona un municipio THEN el sistema SHALL mostrar solo anuncios de ese municipio
4. WHEN un usuario aplica filtros THEN el sistema SHALL actualizar los resultados en tiempo real
5. WHEN un usuario limpia filtros THEN el sistema SHALL mostrar todos los anuncios nuevamente
6. WHEN se aplican filtros THEN el sistema SHALL mantener el rendimiento con respuesta rápida
