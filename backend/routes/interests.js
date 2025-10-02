const express = require('express');
const router = express.Router();
const Interest = require('../models/Interest');
const Listing = require('../models/Listing');
const User = require('../models/User');
const auth = require('../middleware/auth');
const { validateCreateInterest, validateMarkAsRead } = require('../middleware/validators/interestValidator');
const { enviarNotificacionInteres } = require('../services/emailService');

/**
 * @route   POST /api/interests
 * @desc    Expresar interés en un anuncio
 * @access  Private
 */
router.post('/', auth, validateCreateInterest, async (req, res) => {
  try {
    const { listing, mensaje } = req.body;
    const usuarioInteresado = req.user.id;

    // Verificar que el anuncio existe y está activo
    const anuncio = await Listing.findById(listing).populate('usuario');
    if (!anuncio) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'Anuncio no encontrado',
          code: 'LISTING_NOT_FOUND',
        },
      });
    }

    if (!anuncio.activo) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Este anuncio ya no está disponible',
          code: 'LISTING_INACTIVE',
        },
      });
    }

    // Verificar que el usuario no esté interesado en su propio anuncio
    if (anuncio.usuario._id.toString() === usuarioInteresado) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'No puedes expresar interés en tu propio anuncio',
          code: 'SELF_INTEREST_NOT_ALLOWED',
        },
      });
    }

    // Verificar si ya existe un interés de este usuario en este anuncio
    const interesExistente = await Interest.findOne({
      listing,
      usuarioInteresado,
    });

    if (interesExistente) {
      return res.status(409).json({
        success: false,
        error: {
          message: 'Ya has expresado interés en este anuncio',
          code: 'INTEREST_ALREADY_EXISTS',
        },
      });
    }

    // Crear el interés
    const interes = await Interest.create({
      listing,
      usuarioInteresado,
      vendedor: anuncio.usuario._id,
      mensaje: mensaje || '',
    });

    // Obtener información del usuario interesado
    const interesado = await User.findById(usuarioInteresado);

    // Enviar email al vendedor
    try {
      await enviarNotificacionInteres({
        vendedorEmail: anuncio.usuario.email,
        vendedorNombre: anuncio.usuario.nombre || 'Usuario',
        interesadoNombre: interesado.nombre || 'Usuario',
        interesadoEmail: interesado.email,
        interesadoTelefono: interesado.telefono || '',
        listingTitulo: anuncio.titulo,
        listingId: anuncio._id,
        mensaje: mensaje || '',
      });
    } catch (emailError) {
      console.error('Error al enviar email de notificación:', emailError);
      // No fallar la petición si el email falla
    }

    // Poblar el interés creado
    const interesPopulado = await Interest.findById(interes._id)
      .populate('listing', 'titulo precio imagenes')
      .populate('usuarioInteresado', 'nombre email telefono')
      .populate('vendedor', 'nombre email');

    res.status(201).json({
      success: true,
      data: interesPopulado,
    });
  } catch (error) {
    console.error('Error al expresar interés:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Error al expresar interés',
        code: 'INTEREST_CREATE_ERROR',
      },
    });
  }
});

/**
 * @route   GET /api/interests/received
 * @desc    Obtener intereses recibidos (como vendedor)
 * @access  Private
 */
router.get('/received', auth, async (req, res) => {
  try {
    const vendedor = req.user.id;

    const intereses = await Interest.find({ vendedor })
      .populate('listing', 'titulo precio imagenes')
      .populate('usuarioInteresado', 'nombre email telefono estado municipio')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: intereses.length,
      data: intereses,
    });
  } catch (error) {
    console.error('Error al obtener intereses recibidos:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Error al obtener intereses recibidos',
        code: 'INTERESTS_FETCH_ERROR',
      },
    });
  }
});

/**
 * @route   GET /api/interests/sent
 * @desc    Obtener intereses enviados (como comprador)
 * @access  Private
 */
router.get('/sent', auth, async (req, res) => {
  try {
    const usuarioInteresado = req.user.id;

    const intereses = await Interest.find({ usuarioInteresado })
      .populate('listing', 'titulo precio imagenes')
      .populate('vendedor', 'nombre email telefono')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: intereses.length,
      data: intereses,
    });
  } catch (error) {
    console.error('Error al obtener intereses enviados:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Error al obtener intereses enviados',
        code: 'INTERESTS_FETCH_ERROR',
      },
    });
  }
});

/**
 * @route   PUT /api/interests/:id/read
 * @desc    Marcar interés como leído
 * @access  Private
 */
router.put('/:id/read', auth, validateMarkAsRead, async (req, res) => {
  try {
    const interes = await Interest.findById(req.params.id);

    if (!interes) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'Interés no encontrado',
          code: 'INTEREST_NOT_FOUND',
        },
      });
    }

    // Verificar que el usuario es el vendedor (receptor del interés)
    if (interes.vendedor.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: {
          message: 'No tienes permiso para marcar este interés como leído',
          code: 'UNAUTHORIZED',
        },
      });
    }

    interes.leido = true;
    await interes.save();

    const interesPopulado = await Interest.findById(interes._id)
      .populate('listing', 'titulo precio imagenes')
      .populate('usuarioInteresado', 'nombre email telefono')
      .populate('vendedor', 'nombre email');

    res.json({
      success: true,
      data: interesPopulado,
    });
  } catch (error) {
    console.error('Error al marcar interés como leído:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Error al marcar interés como leído',
        code: 'INTEREST_UPDATE_ERROR',
      },
    });
  }
});

module.exports = router;
