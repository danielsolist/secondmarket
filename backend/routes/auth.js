const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Estado = require('../models/Estado');
const Municipio = require('../models/Municipio');
const auth = require('../middleware/auth');
const { validateRegister, validateLogin } = require('../middleware/validators/userValidator');

/**
 * @route   POST /api/auth/register
 * @desc    Registrar nuevo usuario
 * @access  Public
 */
router.post('/register', validateRegister, async (req, res) => {
  try {
    const { email, password, nombre, telefono, estado, municipio } = req.body;

    // Verificar si el usuario ya existe
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        error: {
          message: 'El correo electrónico ya está registrado',
          code: 'EMAIL_EXISTS'
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
          code: 'INVALID_ESTADO'
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
          code: 'INVALID_MUNICIPIO'
        }
      });
    }

    // Crear nuevo usuario
    const user = new User({
      email,
      password,
      nombre,
      telefono,
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
    res.status(500).json({
      success: false,
      error: {
        message: 'Error al registrar usuario',
        code: 'REGISTER_ERROR'
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
        code: 'LOGIN_ERROR'
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
        code: 'GET_USER_ERROR'
      }
    });
  }
});

module.exports = router;
