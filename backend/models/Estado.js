const mongoose = require('mongoose');

const EstadoSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    unique: true
  },
  codigo: {
    type: String,
    required: true,
    unique: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Estado', EstadoSchema);
