const mongoose = require('mongoose');

const ListingSchema = new mongoose.Schema({
  titulo: {
    type: String,
    required: true,
    maxlength: 100
  },
  descripcion: {
    type: String,
    required: true,
    maxlength: 1000
  },
  precio: {
    type: Number,
    required: true,
    min: 0
  },
  imagenes: {
    type: [String],
    validate: {
      validator: function(v) {
        return v && v.length >= 1 && v.length <= 5;
      },
      message: 'Debe haber entre 1 y 5 imágenes'
    }
  },
  usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  codigoPostal: {
    type: String,
    required: true
  },
  colonia: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Colonia',
    required: true
  },
  estado: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Estado',
    required: true
  },
  municipio: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Municipio',
    required: true
  },
  activo: {
    type: Boolean,
    default: true
  },
  vistas: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

// Index for filtering by location
ListingSchema.index({ estado: 1, municipio: 1 });
ListingSchema.index({ activo: 1, createdAt: -1 });

module.exports = mongoose.model('Listing', ListingSchema);
