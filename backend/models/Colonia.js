const mongoose = require('mongoose');

const ColoniaSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true
  },
  codigoPostal: {
    type: String,
    required: true,
    index: true
  },
  municipio: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Municipio',
    required: true
  },
  estado: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Estado',
    required: true
  }
}, { timestamps: true });

// Índice compuesto para búsquedas eficientes
ColoniaSchema.index({ codigoPostal: 1, nombre: 1 });
ColoniaSchema.index({ municipio: 1 });
ColoniaSchema.index({ estado: 1 });

module.exports = mongoose.model('Colonia', ColoniaSchema);
