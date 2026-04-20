const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true,
    unique: true
  },
  store: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    default: 0
  },
  description: {
    type: String
  },
  images: [{
    type: String
  }],
  isFavorite: {
    type: Boolean,
    default: false
  },
  winnerScore: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Product', productSchema);

