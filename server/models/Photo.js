const mongoose = require('mongoose');

const photoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Photo title is required'],
    trim: true,
  },
  description: {
    type: String,
    default: '',
    trim: true,
  },
  imageUrl: {
    type: String,
    required: [true, 'Image URL or file path is required'],
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['Nature', 'Architecture', 'Portrait', 'Travel', 'Street'],
    default: 'Nature',
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, {
  timestamps: true,
});

// Index for search optimization
photoSchema.index({ title: 'text', description: 'text' });

module.exports = mongoose.model('Photo', photoSchema);
