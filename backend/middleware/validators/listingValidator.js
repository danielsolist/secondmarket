const { body, param, query, validationResult } = require('express-validator');

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
 * Validaciones para crear anuncio
 */
const validateCreateListing = [
  body('titulo')
    .trim()
    .notEmpty()
    .withMessage('El título es requerido')
    .isLength({ min: 5, max: 100 })
    .withMessage('El título debe tener entre 5 y 100 caracteres'),
  
  body('descripcion')
    .trim()
    .notEmpty()
    .withMessage('La descripción es requerida')
    .isLength({ min: 10, max: 1000 })
    .withMessage('La descripción debe tener entre 10 y 1000 caracteres'),
  
  body('precio')
    .notEmpty()
    .withMessage('El precio es requerido')
    .isFloat({ min: 0 })
    .withMessage('El precio debe ser un número mayor o igual a 0'),
  
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
 * Validaciones para actualizar anuncio
 */
const validateUpdateListing = [
  param('id')
    .isMongoId()
    .withMessage('ID de anuncio inválido'),
  
  body('titulo')
    .optional()
    .trim()
    .isLength({ min: 5, max: 100 })
    .withMessage('El título debe tener entre 5 y 100 caracteres'),
  
  body('descripcion')
    .optional()
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage('La descripción debe tener entre 10 y 1000 caracteres'),
  
  body('precio')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('El precio debe ser un número mayor o igual a 0'),
  
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
 * Validación para parámetro de ID de anuncio
 */
const validateListingId = [
  param('id')
    .isMongoId()
    .withMessage('ID de anuncio inválido'),
  
  handleValidationErrors
];

/**
 * Validación para parámetro de ID de usuario
 */
const validateUserIdParam = [
  param('userId')
    .isMongoId()
    .withMessage('ID de usuario inválido'),
  
  handleValidationErrors
];

/**
 * Validaciones para query params de filtrado
 */
const validateListingFilters = [
  query('estado')
    .optional()
    .isMongoId()
    .withMessage('ID de estado inválido'),
  
  query('municipio')
    .optional()
    .isMongoId()
    .withMessage('ID de municipio inválido'),
  
  query('search')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('El término de búsqueda debe tener entre 1 y 100 caracteres'),
  
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('La página debe ser un número entero mayor a 0'),
  
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('El límite debe ser un número entre 1 y 100'),
  
  handleValidationErrors
];

module.exports = {
  validateCreateListing,
  validateUpdateListing,
  validateListingId,
  validateUserIdParam,
  validateListingFilters,
  handleValidationErrors
};
