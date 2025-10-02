const mongoose = require('mongoose');

const InterestSchema = new mongoose.Schema({
  listing: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Listing',
    required: true
  },
  usuarioInteresado: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  vendedor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  mensaje: {
    type: String,
    maxlength: 500
  },
  leido: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

// Prevent duplicate interests from same user on same listing
InterestSchema.index({ listing: 1, usuarioInteresado: 1 }, { unique: true });

module.exports = mongoose.model('Interest', InterestSchema);
