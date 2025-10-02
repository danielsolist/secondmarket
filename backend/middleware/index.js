/**
 * Exportación centralizada de todos los middlewares
 */

const auth = require('./auth');
const { upload, handleMulterError } = require('./upload');
const { errorHandler, notFound, AppError } = require('./errorHandler');

// Validators
const userValidator = require('./validators/userValidator');
const listingValidator = require('./validators/listingValidator');
const interestValidator = require('./validators/interestValidator');

module.exports = {
  // Auth
  auth,
  
  // Upload
  upload,
  handleMulterError,
  
  // Error handling
  errorHandler,
  notFound,
  AppError,
  
  // Validators
  userValidator,
  listingValidator,
  interestValidator
};
