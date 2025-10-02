const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Estado = require('../models/Estado');
const Municipio = require('../models/Municipio');
const Colonia = require('../models/Colonia');
const auth = require('../middleware/auth');
const { validateRegister, validateLogin } = require('../middleware/validators/userValidator');

/**
 * @route   POST /api/auth/register
 * @desc    Registrar nuevo usuario
 * @access  Public
 */
router.post('/register', validateRegister, async (req, res) => {
  try {
    const { email, password, nombre, telefono, codigoPostal, colonia, estado, municipio } = req.body;

    // Verificar si el usuario ya existe
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        error: {
          message: 'El correo electrónico ya está registrado',
          code: 'EMAIL_EXISTS',
          field: 'email'
        }
      });
    }

    // Verificar código postal
    if (!codigoPostal || codigoPostal.length !== 5) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'El código postal debe tener 5 dígitos',
          code: 'INVALID_CODIGO_POSTAL',
          field: 'codigoPostal'
        }
      });
    }

    // Verificar que la colonia existe
    const coloniaExists = await Colonia.findById(colonia);
    if (!coloniaExists) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'La colonia seleccionada no existe',
          code: 'INVALID_COLONIA',
          field: 'colonia'
        }
      });
    }

    // Verificar que el estado existe
    const estadoExists = await Estado.findById(estado);
    if (!estadoExists) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'El estado seleccionado no existe',
          code: 'INVALID_ESTADO',
          field: 'estado'
        }
      });
    }

    // Verificar que el municipio existe y pertenece al estado
    const municipioExists = await Municipio.findOne({ _id: municipio, estado });
    if (!municipioExists) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'El municipio seleccionado no existe o no pertenece al estado',
          code: 'INVALID_MUNICIPIO',
          field: 'municipio'
        }
      });
    }

    // Verificar que la colonia pertenece al municipio y estado
    if (coloniaExists.municipio.toString() !== municipio || coloniaExists.estado.toString() !== estado) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'La colonia no pertenece al municipio y estado seleccionados',
          code: 'COLONIA_MISMATCH',
          field: 'colonia'
        }
      });
    }

    // Validar teléfono si se proporciona
    if (telefono && !/^\d{10,13}$/.test(telefono)) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'El teléfono debe contener entre 10 y 13 dígitos',
          code: 'INVALID_TELEFONO',
          field: 'telefono'
        }
      });
    }

    // Crear nuevo usuario
    const user = new User({
      email,
      password,
      nombre,
      telefono,
      codigoPostal,
      colonia,
      estado,
      municipio
    });

    await user.save();

    // Generar JWT token
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE || '7d' }
    );

    // Retornar usuario sin contraseña
    const userResponse = await User.findById(user._id)
      .select('-password')
      .populate('colonia', 'nombre codigoPostal')
      .populate('estado', 'nombre')
      .populate('municipio', 'nombre');

    res.status(201).json({
      success: true,
      data: {
        token,
        user: userResponse
      }
    });
  } catch (error) {
    console.error('Error en registro:', error);
    
    // Manejar errores de validación de Mongoose
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        error: {
          message: messages.join(', '),
          code: 'VALIDATION_ERROR',
          details: error.errors
        }
      });
    }
    
    res.status(500).json({
      success: false,
      error: {
        message: 'Error al registrar usuario',
        code: 'REGISTER_ERROR',
        details: error.message
      }
    });
  }
});

/**
 * @route   POST /api/auth/login
 * @desc    Iniciar sesión
 * @access  Public
 */
router.post('/login', validateLogin, async (req, res) => {
  try {
    const { email, password } = req.body;

    // Buscar usuario por email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        error: {
          message: 'Credenciales incorrectas',
          code: 'INVALID_CREDENTIALS'
        }
      });
    }

    // Verificar si el usuario está activo
    if (!user.activo) {
      return res.status(401).json({
        success: false,
        error: {
          message: 'La cuenta está inactiva',
          code: 'ACCOUNT_INACTIVE'
        }
      });
    }

    // Verificar contraseña
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: {
          message: 'Credenciales incorrectas',
          code: 'INVALID_CREDENTIALS'
        }
      });
    }

    // Generar JWT token
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE || '7d' }
    );

    // Retornar usuario sin contraseña
    const userResponse = await User.findById(user._id)
      .select('-password')
      .populate('colonia', 'nombre codigoPostal')
      .populate('estado', 'nombre')
      .populate('municipio', 'nombre');

    res.json({
      success: true,
      data: {
        token,
        user: userResponse
      }
    });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Error al iniciar sesión',
        code: 'LOGIN_ERROR',
        details: error.message
      }
    });
  }
});

/**
 * @route   GET /api/auth/me
 * @desc    Obtener usuario autenticado
 * @access  Private
 */
router.get('/me', auth, async (req, res) => {
  try {
    // El usuario ya está adjunto al request por el middleware auth
    const user = await User.findById(req.user._id)
      .select('-password')
      .populate('colonia', 'nombre codigoPostal')
      .populate('estado', 'nombre')
      .populate('municipio', 'nombre');

    if (!user) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'Usuario no encontrado',
          code: 'USER_NOT_FOUND'
        }
      });
    }

    res.json({
      success: true,
      data: {
        user
      }
    });
  } catch (error) {
    console.error('Error al obtener usuario:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Error al obtener usuario',
        code: 'GET_USER_ERROR',
        details: error.message
      }
    });
  }
});

module.exports = router;
