const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Middleware de autenticación JWT
 * Verifica el token JWT en el header Authorization
 * Adjunta el usuario al request si el token es válido
 */
const auth = async (req, res, next) => {
  try {
    // Obtener token del header
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({
        success: false,
        error: {
          message: 'No se proporcionó token de autenticación',
          code: 'NO_TOKEN'
        }
      });
    }

    // Verificar token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Buscar usuario
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return res.status(401).json({
        success: false,
        error: {
          message: 'Usuario no encontrado',
          code: 'USER_NOT_FOUND'
        }
      });
    }

    if (!user.activo) {
      return res.status(401).json({
        success: false,
        error: {
          message: 'Usuario inactivo',
          code: 'USER_INACTIVE'
        }
      });
    }

    // Adjuntar usuario al request
    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        error: {
          message: 'Token inválido',
          code: 'INVALID_TOKEN'
        }
      });
    }

    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        error: {
          message: 'Token expirado',
          code: 'TOKEN_EXPIRED'
        }
      });
    }

    res.status(500).json({
      success: false,
      error: {
        message: 'Error en autenticación',
        code: 'AUTH_ERROR'
      }
    });
  }
};

module.exports = auth;
