const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Estado = require('../models/Estado');
const Municipio = require('../models/Municipio');
const auth = require('../middleware/auth');
const { validateUpdate, validateUserId } = require('../middleware/validators/userValidator');

/**
 * @route   GET /api/users/:id
 * @desc    Obtener perfil de usuario
 * @access  Private
 */
router.get('/:id', auth, validateUserId, async (req, res) => {
  try {
    const { id } = req.params;

    // Verificar que el usuario solo pueda ver su propio perfil
    if (req.user._id.toString() !== id) {
      return res.status(403).json({
        success: false,
        error: {
          message: 'No tienes permiso para ver este perfil',
          code: 'FORBIDDEN'
        }
      });
    }

    const user = await User.findById(id)
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

/**
 * @route   PUT /api/users/:id
 * @desc    Actualizar usuario
 * @access  Private
 */
router.put('/:id', auth, validateUpdate, async (req, res) => {
  try {
    const { id } = req.params;
    const { email, password, nombre, telefono, estado, municipio } = req.body;

    // Verificar que el usuario solo pueda modificar su propia cuenta
    if (req.user._id.toString() !== id) {
      return res.status(403).json({
        success: false,
        error: {
          message: 'No tienes permiso para modificar esta cuenta',
          code: 'FORBIDDEN'
        }
      });
    }

    // Buscar usuario
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'Usuario no encontrado',
          code: 'USER_NOT_FOUND'
        }
      });
    }

    // Verificar si el email ya está en uso por otro usuario
    if (email && email !== user.email) {
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
    }

    // Verificar que el estado existe si se proporciona
    if (estado) {
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
    }

    // Verificar que el municipio existe y pertenece al estado si se proporciona
    if (municipio) {
      const estadoId = estado || user.estado;
      const municipioExists = await Municipio.findOne({ _id: municipio, estado: estadoId });
      if (!municipioExists) {
        return res.status(400).json({
          success: false,
          error: {
            message: 'El municipio seleccionado no existe o no pertenece al estado',
            code: 'INVALID_MUNICIPIO'
          }
        });
      }
    }

    // Actualizar campos
    if (email) user.email = email;
    if (password) user.password = password; // El pre-save hook se encargará del hash
    if (nombre !== undefined) user.nombre = nombre;
    if (telefono !== undefined) user.telefono = telefono;
    if (estado) user.estado = estado;
    if (municipio) user.municipio = municipio;

    await user.save();

    // Retornar usuario actualizado sin contraseña
    const updatedUser = await User.findById(id)
      .select('-password')
      .populate('estado', 'nombre')
      .populate('municipio', 'nombre');

    res.json({
      success: true,
      data: {
        user: updatedUser
      }
    });
  } catch (error) {
    console.error('Error al actualizar usuario:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Error al actualizar usuario',
        code: 'UPDATE_USER_ERROR'
      }
    });
  }
});

/**
 * @route   DELETE /api/users/:id
 * @desc    Dar de baja cuenta de usuario
 * @access  Private
 */
router.delete('/:id', auth, validateUserId, async (req, res) => {
  try {
    const { id } = req.params;

    // Verificar que el usuario solo pueda eliminar su propia cuenta
    if (req.user._id.toString() !== id) {
      return res.status(403).json({
        success: false,
        error: {
          message: 'No tienes permiso para eliminar esta cuenta',
          code: 'FORBIDDEN'
        }
      });
    }

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'Usuario no encontrado',
          code: 'USER_NOT_FOUND'
        }
      });
    }

    // Desactivar usuario en lugar de eliminarlo (soft delete)
    user.activo = false;
    await user.save();

    res.json({
      success: true,
      data: {
        message: 'Cuenta desactivada exitosamente'
      }
    });
  } catch (error) {
    console.error('Error al dar de baja usuario:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Error al dar de baja usuario',
        code: 'DELETE_USER_ERROR'
      }
    });
  }
});

module.exports = router;
