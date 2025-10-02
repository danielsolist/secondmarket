const mongoose = require('mongoose');

const MunicipioSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true
  },
  estado: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Estado',
    required: true
  }
}, { timestamps: true });

MunicipioSchema.index({ nombre: 1, estado: 1 }, { unique: true });

module.exports = mongoose.model('Municipio', MunicipioSchema);
