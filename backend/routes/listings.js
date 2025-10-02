const express = require('express');
const router = express.Router();
const Listing = require('../models/Listing');
const auth = require('../middleware/auth');
const { upload, handleMulterError } = require('../middleware/upload');
const {
  validateCreateListing,
  validateUpdateListing,
  validateListingId,
  validateUserIdParam
} = require('../middleware/validators/listingValidator');

/**
 * @route   GET /api/listings
 * @desc    Listar todos los anuncios con filtros opcionales
 * @access  Public
 */
router.get('/', async (req, res) => {
  try {
    const { estado, municipio, search, page = 1, limit = 20 } = req.query;

    // Construir query de filtrado
    const query = { activo: true };

    if (estado) {
      query.estado = estado;
    }

    if (municipio) {
      query.municipio = municipio;
    }

    if (search) {
      query.$or = [
        { titulo: { $regex: search, $options: 'i' } },
        { descripcion: { $regex: search, $options: 'i' } }
      ];
    }

    // Calcular paginación
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Ejecutar query con populate y paginación
    const listings = await Listing.find(query)
      .populate('usuario', 'nombre email')
      .populate('estado', 'nombre')
      .populate('municipio', 'nombre')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    // Contar total de documentos para paginación
    const total = await Listing.countDocuments(query);

    res.json({
      success: true,
      data: {
        listings,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / parseInt(limit))
        }
      }
    });
  } catch (error) {
    console.error('Error al listar anuncios:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Error al listar anuncios',
        code: 'LIST_LISTINGS_ERROR'
      }
    });
  }
});

/**
 * @route   POST /api/listings
 * @desc    Crear nuevo anuncio con upload de múltiples imágenes
 * @access  Private
 */
router.post(
  '/',
  auth,
  upload.array('imagenes', 5),
  handleMulterError,
  validateCreateListing,
  async (req, res) => {
    try {
      const { titulo, descripcion, precio, estado, municipio } = req.body;

      // Validar que se hayan subido imágenes
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({
          success: false,
          error: {
            message: 'Debe subir al menos una imagen',
            code: 'NO_IMAGES'
          }
        });
      }

      // Obtener URLs de las imágenes subidas
      const imagenes = req.files.map(file => `/uploads/${file.filename}`);

      // Crear anuncio
      const listing = await Listing.create({
        titulo,
        descripcion,
        precio,
        imagenes,
        estado,
        municipio,
        usuario: req.user._id
      });

      // Poblar referencias para la respuesta
      await listing.populate([
        { path: 'usuario', select: 'nombre email' },
        { path: 'estado', select: 'nombre' },
        { path: 'municipio', select: 'nombre' }
      ]);

      res.status(201).json({
        success: true,
        data: {
          listing
        }
      });
    } catch (error) {
      console.error('Error al crear anuncio:', error);
      res.status(500).json({
        success: false,
        error: {
          message: 'Error al crear anuncio',
          code: 'CREATE_LISTING_ERROR'
        }
      });
    }
  }
);

/**
 * @route   GET /api/listings/user/:userId
 * @desc    Listar anuncios de un usuario específico
 * @access  Private
 */
router.get(
  '/user/:userId',
  auth,
  validateUserIdParam,
  async (req, res) => {
    try {
      const { userId } = req.params;
      const { page = 1, limit = 20, includeInactive = false } = req.query;

      // Construir query
      const query = { usuario: userId };

      // Si el usuario solicita sus propios anuncios, puede ver los inactivos
      if (req.user._id.toString() === userId) {
        if (!includeInactive) {
          query.activo = true;
        }
      } else {
        // Otros usuarios solo ven anuncios activos
        query.activo = true;
      }

      // Calcular paginación
      const skip = (parseInt(page) - 1) * parseInt(limit);

      // Ejecutar query con populate y paginación
      const listings = await Listing.find(query)
        .populate('usuario', 'nombre email')
        .populate('estado', 'nombre')
        .populate('municipio', 'nombre')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit));

      // Contar total de documentos para paginación
      const total = await Listing.countDocuments(query);

      res.json({
        success: true,
        data: {
          listings,
          pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total,
            pages: Math.ceil(total / parseInt(limit))
          }
        }
      });
    } catch (error) {
      console.error('Error al listar anuncios del usuario:', error);

      // Manejar error de ID inválido
      if (error.name === 'CastError') {
        return res.status(400).json({
          success: false,
          error: {
            message: 'ID de usuario inválido',
            code: 'INVALID_USER_ID'
          }
        });
      }

      res.status(500).json({
        success: false,
        error: {
          message: 'Error al listar anuncios del usuario',
          code: 'LIST_USER_LISTINGS_ERROR'
        }
      });
    }
  }
);

/**
 * @route   GET /api/listings/:id
 * @desc    Obtener anuncio específico e incrementar contador de vistas
 * @access  Public
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Buscar anuncio y poblar referencias
    const listing = await Listing.findById(id)
      .populate('usuario', 'nombre email telefono')
      .populate('estado', 'nombre')
      .populate('municipio', 'nombre');

    if (!listing) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'Anuncio no encontrado',
          code: 'LISTING_NOT_FOUND'
        }
      });
    }

    // Verificar que el anuncio esté activo
    if (!listing.activo) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'Anuncio no disponible',
          code: 'LISTING_NOT_AVAILABLE'
        }
      });
    }

    // Incrementar contador de vistas
    listing.vistas += 1;
    await listing.save();

    res.json({
      success: true,
      data: {
        listing
      }
    });
  } catch (error) {
    console.error('Error al obtener anuncio:', error);
    
    // Manejar error de ID inválido
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        error: {
          message: 'ID de anuncio inválido',
          code: 'INVALID_LISTING_ID'
        }
      });
    }

    res.status(500).json({
      success: false,
      error: {
        message: 'Error al obtener anuncio',
        code: 'GET_LISTING_ERROR'
      }
    });
  }
});

/**
 * @route   PUT /api/listings/:id
 * @desc    Actualizar anuncio existente
 * @access  Private
 */
router.put(
  '/:id',
  auth,
  upload.array('imagenes', 5),
  handleMulterError,
  validateUpdateListing,
  async (req, res) => {
    try {
      const { id } = req.params;
      const { titulo, descripcion, precio, estado, municipio } = req.body;

      // Buscar anuncio
      const listing = await Listing.findById(id);

      if (!listing) {
        return res.status(404).json({
          success: false,
          error: {
            message: 'Anuncio no encontrado',
            code: 'LISTING_NOT_FOUND'
          }
        });
      }

      // Verificar propiedad - usuario solo puede modificar sus anuncios
      if (listing.usuario.toString() !== req.user._id.toString()) {
        return res.status(403).json({
          success: false,
          error: {
            message: 'No tienes permiso para modificar este anuncio',
            code: 'FORBIDDEN'
          }
        });
      }

      // Actualizar campos si se proporcionan
      if (titulo) listing.titulo = titulo;
      if (descripcion) listing.descripcion = descripcion;
      if (precio !== undefined) listing.precio = precio;
      if (estado) listing.estado = estado;
      if (municipio) listing.municipio = municipio;

      // Si se subieron nuevas imágenes, reemplazar las existentes
      if (req.files && req.files.length > 0) {
        const nuevasImagenes = req.files.map(file => `/uploads/${file.filename}`);
        listing.imagenes = nuevasImagenes;
      }

      await listing.save();

      // Poblar referencias para la respuesta
      await listing.populate([
        { path: 'usuario', select: 'nombre email' },
        { path: 'estado', select: 'nombre' },
        { path: 'municipio', select: 'nombre' }
      ]);

      res.json({
        success: true,
        data: {
          listing
        }
      });
    } catch (error) {
      console.error('Error al actualizar anuncio:', error);

      // Manejar error de ID inválido
      if (error.name === 'CastError') {
        return res.status(400).json({
          success: false,
          error: {
            message: 'ID de anuncio inválido',
            code: 'INVALID_LISTING_ID'
          }
        });
      }

      res.status(500).json({
        success: false,
        error: {
          message: 'Error al actualizar anuncio',
          code: 'UPDATE_LISTING_ERROR'
        }
      });
    }
  }
);

/**
 * @route   DELETE /api/listings/:id
 * @desc    Eliminar anuncio (marcar como inactivo)
 * @access  Private
 */
router.delete(
  '/:id',
  auth,
  validateListingId,
  async (req, res) => {
    try {
      const { id } = req.params;

      // Buscar anuncio
      const listing = await Listing.findById(id);

      if (!listing) {
        return res.status(404).json({
          success: false,
          error: {
            message: 'Anuncio no encontrado',
            code: 'LISTING_NOT_FOUND'
          }
        });
      }

      // Verificar propiedad - usuario solo puede eliminar sus anuncios
      if (listing.usuario.toString() !== req.user._id.toString()) {
        return res.status(403).json({
          success: false,
          error: {
            message: 'No tienes permiso para eliminar este anuncio',
            code: 'FORBIDDEN'
          }
        });
      }

      // Marcar como inactivo en lugar de eliminar físicamente
      listing.activo = false;
      await listing.save();

      res.json({
        success: true,
        data: {
          message: 'Anuncio eliminado exitosamente'
        }
      });
    } catch (error) {
      console.error('Error al eliminar anuncio:', error);

      // Manejar error de ID inválido
      if (error.name === 'CastError') {
        return res.status(400).json({
          success: false,
          error: {
            message: 'ID de anuncio inválido',
            code: 'INVALID_LISTING_ID'
          }
        });
      }

      res.status(500).json({
        success: false,
        error: {
          message: 'Error al eliminar anuncio',
          code: 'DELETE_LISTING_ERROR'
        }
      });
    }
  }
);

module.exports = router;
