const { body, param, validationResult } = require('express-validator');

/**
 * Middleware para manejar errores de validación
 */
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: {
        message: 'Errores de validación',
        code: 'VALIDATION_ERROR',
        details: errors.array()
      }
    });
  }
  next();
};

/**
 * Validaciones para registro de usuario
 */
const validateRegister = [
  body('email')
    .trim()
    .isEmail()
    .withMessage('Debe proporcionar un email válido')
    .normalizeEmail(),
  
  body('password')
    .isLength({ min: 8, max: 8 })
    .withMessage('La contraseña debe tener exactamente 8 caracteres'),
  
  body('nombre')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('El nombre debe tener entre 2 y 100 caracteres'),
  
  body('telefono')
    .optional()
    .trim()
    .matches(/^[0-9]{10}$/)
    .withMessage('El teléfono debe tener 10 dígitos'),
  
  body('estado')
    .notEmpty()
    .withMessage('El estado es requerido')
    .isMongoId()
    .withMessage('ID de estado inválido'),
  
  body('municipio')
    .notEmpty()
    .withMessage('El municipio es requerido')
    .isMongoId()
    .withMessage('ID de municipio inválido'),
  
  handleValidationErrors
];

/**
 * Validaciones para login
 */
const validateLogin = [
  body('email')
    .trim()
    .isEmail()
    .withMessage('Debe proporcionar un email válido')
    .normalizeEmail(),
  
  body('password')
    .notEmpty()
    .withMessage('La contraseña es requerida'),
  
  handleValidationErrors
];

/**
 * Validaciones para actualizar usuario
 */
const validateUpdate = [
  param('id')
    .isMongoId()
    .withMessage('ID de usuario inválido'),
  
  body('email')
    .optional()
    .trim()
    .isEmail()
    .withMessage('Debe proporcionar un email válido')
    .normalizeEmail(),
  
  body('password')
    .optional()
    .isLength({ min: 8, max: 8 })
    .withMessage('La contraseña debe tener exactamente 8 caracteres'),
  
  body('nombre')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('El nombre debe tener entre 2 y 100 caracteres'),
  
  body('telefono')
    .optional()
    .trim()
    .matches(/^[0-9]{10}$/)
    .withMessage('El teléfono debe tener 10 dígitos'),
  
  body('estado')
    .optional()
    .isMongoId()
    .withMessage('ID de estado inválido'),
  
  body('municipio')
    .optional()
    .isMongoId()
    .withMessage('ID de municipio inválido'),
  
  handleValidationErrors
];

/**
 * Validación para parámetro de ID
 */
const validateUserId = [
  param('id')
    .isMongoId()
    .withMessage('ID de usuario inválido'),
  
  handleValidationErrors
];

module.exports = {
  validateRegister,
  validateLogin,
  validateUpdate,
  validateUserId,
  handleValidationErrors
};
