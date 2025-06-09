# Proyecto Hospisoft

Proyecto de gestión hospitalaria desarrollado con Node.js, MongoDB, y React (Core UI + Bootstrap). Implementa autenticación segura usando JSON Web Tokens (JWT).

---

## Tecnologías y dependencias principales

### Backend (Node.js)

- **express**: Framework web para Node.js que facilita la creación de APIs REST.
- **mongoose**: ODM para modelar y gestionar datos en MongoDB.
- **jsonwebtoken**: Para crear y verificar JSON Web Tokens (JWT) en la autenticación.
- **bcryptjs**: Para hashear y comparar contraseñas de forma segura.
- **celebrate**: Middleware para validación de datos en rutas usando Joi.
- **cors**: Middleware para habilitar CORS y permitir peticiones desde el frontend.
- **multer**: Middleware para manejo de subida de archivos.
- **nodemon**: Herramienta para reiniciar automáticamente el servidor en desarrollo.
- **dotenv**: Para cargar variables de entorno desde archivo `.env`.

---

## Instalación

**1. Clonar el repositorio**:

- git clone https://github.com/NicolasMoralesC10/Backend-Hospisoft.git
- cd Backend-Hospisoft

**2. Instalar dependencias**:

- npm install

**3. Crear archivo `.env` en la raíz con las variables necesarias**:

- JWT_SECRET=clave_secreta_segura
- _Comando para generar la clave usando Node_: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

**4. Iniciar el servidor en modo desarrollo**:

- npm start

---

## Scripts disponibles

- `npm start`: Ejecuta el servidor con nodemon para desarrollo.

---

## Estructura del proyecto

- `/controllers`: Lógica de negocio y controladores.
- `/middlewares`: Middlewares personalizados (autenticación, manejo de errores).
- `/models`: Modelos de datos con Mongoose.
- `/routes`: Definición de rutas y validaciones con celebrate.
- `/config`: Configuraciones y carga de variables de entorno.

---

## Uso de autenticación con JWT

- La clave secreta para firmar los tokens se define en la variable de entorno `JWT_SECRET`.
- Las rutas protegidas usan un middleware que verifica el token enviado en el header `Authorization`.
- Las contraseñas se almacenan hasheadas con bcryptjs.

---

## Dependencias listadas en el package.json

{
"bcryptjs": "^3.0.2",
"celebrate": "^15.0.3",
"cors": "^2.8.5",
"dotenv": "^16.0.0",
"express": "^5.1.0",
"jsonwebtoken": "^9.0.2",
"mongoose": "^8.14.0",
"multer": "^1.4.5-lts.2",
"nodemon": "^3.1.9"
}

---
