const express = require('express');
const router = express.Router();
const Estado = require('../models/Estado');
const Municipio = require('../models/Municipio');
const Colonia = require('../models/Colonia');

// @route   GET /api/locations/estados
// @desc    Listar todos los estados
// @access  Public
router.get('/estados', async (req, res) => {
  try {
    const estados = await Estado.find().sort({ nombre: 1 });
    res.json({
      success: true,
      count: estados.length,
      data: estados
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        message: 'Error al obtener estados',
        code: 'ESTADOS_FETCH_ERROR'
      }
    });
  }
});

// @route   GET /api/locations/estados/:id/municipios
// @desc    Listar municipios por estado
// @access  Public
router.get('/estados/:id/municipios', async (req, res) => {
  try {
    const { id } = req.params;

    // Verificar que el estado existe
    const estado = await Estado.findById(id);
    if (!estado) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'Estado no encontrado',
          code: 'ESTADO_NOT_FOUND'
        }
      });
    }

    // Obtener municipios del estado
    const municipios = await Municipio.find({ estado: id })
      .sort({ nombre: 1 })
      .populate('estado', 'nombre codigo');

    res.json({
      success: true,
      count: municipios.length,
      data: municipios
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        message: 'Error al obtener municipios',
        code: 'MUNICIPIOS_FETCH_ERROR'
      }
    });
  }
});

// @route   GET /api/locations/municipios/:id
// @desc    Obtener municipio específico
// @access  Public
router.get('/municipios/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const municipio = await Municipio.findById(id).populate('estado', 'nombre codigo');

    if (!municipio) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'Municipio no encontrado',
          code: 'MUNICIPIO_NOT_FOUND'
        }
      });
    }

    res.json({
      success: true,
      data: municipio
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        message: 'Error al obtener municipio',
        code: 'MUNICIPIO_FETCH_ERROR'
      }
    });
  }
});

// @route   GET /api/locations/colonias/cp/:codigoPostal
// @desc    Obtener colonias por código postal
// @access  Public
router.get('/colonias/cp/:codigoPostal', async (req, res) => {
  try {
    const { codigoPostal } = req.params;

    const colonias = await Colonia.find({ codigoPostal })
      .populate('municipio', 'nombre')
      .populate('estado', 'nombre codigo')
      .sort({ nombre: 1 });

    res.json({
      success: true,
      count: colonias.length,
      data: colonias
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        message: 'Error al obtener colonias',
        code: 'COLONIAS_FETCH_ERROR'
      }
    });
  }
});

// @route   GET /api/locations/municipios/:id/colonias
// @desc    Obtener colonias por municipio
// @access  Public
router.get('/municipios/:id/colonias', async (req, res) => {
  try {
    const { id } = req.params;

    const colonias = await Colonia.find({ municipio: id })
      .sort({ nombre: 1 });

    res.json({
      success: true,
      count: colonias.length,
      data: colonias
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        message: 'Error al obtener colonias',
        code: 'COLONIAS_FETCH_ERROR'
      }
    });
  }
});

module.exports = router;
