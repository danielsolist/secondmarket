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
 * Validaciones para crear interés
 */
const validateCreateInterest = [
  body('listing')
    .notEmpty()
    .withMessage('El ID del anuncio es requerido')
    .isMongoId()
    .withMessage('ID de anuncio inválido'),
  
  body('mensaje')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('El mensaje no puede exceder 500 caracteres'),
  
  handleValidationErrors
];

/**
 * Validación para parámetro de ID de interés
 */
const validateInterestId = [
  param('id')
    .isMongoId()
    .withMessage('ID de interés inválido'),
  
  handleValidationErrors
];

/**
 * Validación para marcar como leído
 */
const validateMarkAsRead = [
  param('id')
    .isMongoId()
    .withMessage('ID de interés inválido'),
  
  handleValidationErrors
];

module.exports = {
  validateCreateInterest,
  validateInterestId,
  validateMarkAsRead,
  handleValidationErrors
};
