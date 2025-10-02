/**
 * Middleware global de manejo de errores
 * Captura todos los errores de la aplicación y retorna respuestas consistentes
 */
const errorHandler = (err, req, res, next) => {
  // Log del error para debugging
  console.error('Error:', {
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    path: req.path,
    method: req.method
  });

  // Error de validación de Mongoose
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map(e => ({
      field: e.path,
      message: e.message
    }));
    
    return res.status(400).json({
      success: false,
      error: {
        message: 'Error de validación',
        code: 'VALIDATION_ERROR',
        details: errors
      }
    });
  }

  // Error de cast de Mongoose (ID inválido)
  if (err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      error: {
        message: 'ID inválido',
        code: 'INVALID_ID',
        details: { field: err.path, value: err.value }
      }
    });
  }

  // Error de duplicado (unique constraint)
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    return res.status(409).json({
      success: false,
      error: {
        message: `El ${field} ya está registrado`,
        code: 'DUPLICATE_ERROR',
        details: { field }
      }
    });
  }

  // Error de JWT
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      error: {
        message: 'Token inválido',
        code: 'INVALID_TOKEN'
      }
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      error: {
        message: 'Token expirado',
        code: 'TOKEN_EXPIRED'
      }
    });
  }

  // Error de Multer (ya manejado en upload.js, pero por si acaso)
  if (err.name === 'MulterError') {
    return res.status(400).json({
      success: false,
      error: {
        message: err.message,
        code: 'UPLOAD_ERROR'
      }
    });
  }

  // Errores personalizados con statusCode
  if (err.statusCode) {
    return res.status(err.statusCode).json({
      success: false,
      error: {
        message: err.message,
        code: err.code || 'CUSTOM_ERROR'
      }
    });
  }

  // Error genérico del servidor
  res.status(500).json({
    success: false,
    error: {
      message: process.env.NODE_ENV === 'development' 
        ? err.message 
        : 'Error interno del servidor',
      code: 'SERVER_ERROR'
    }
  });
};

/**
 * Middleware para rutas no encontradas (404)
 */
const notFound = (req, res, next) => {
  res.status(404).json({
    success: false,
    error: {
      message: `Ruta no encontrada: ${req.originalUrl}`,
      code: 'NOT_FOUND'
    }
  });
};

/**
 * Clase de error personalizado para la aplicación
 */
class AppError extends Error {
  constructor(message, statusCode, code) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = {
  errorHandler,
  notFound,
  AppError
};
