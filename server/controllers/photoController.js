const fs = require('fs');
const path = require('path');
const Photo = require('../models/Photo');
const User = require('../models/User');

// @desc    Get all photos with search and category filters
// @route   GET /api/photos
// @access  Public
const getPhotos = async (req, res) => {
  try {
    const { search, category } = req.query;
    let query = {};

    if (category && category !== 'All') {
      query.category = category;
    }

    if (search && search.trim() !== '') {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { title: searchRegex },
        { description: searchRegex }
      ];
    }

    const photos = await Photo.find(query)
      .populate('uploadedBy', 'name email role')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: photos.length,
      photos,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get a single photo by ID
// @route   GET /api/photos/:id
// @access  Public
const getPhotoById = async (req, res) => {
  try {
    const photo = await Photo.findById(req.params.id).populate('uploadedBy', 'name email role');
    if (!photo) {
      return res.status(404).json({ success: false, message: 'Photo not found' });
    }
    res.json({
      success: true,
      photo,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Invalid photo ID or resource missing' });
  }
};

// @desc    Upload / create a new photo
// @route   POST /api/photos
// @access  Admin only
const createPhoto = async (req, res) => {
  try {
    const { title, description, category, imageUrl: directUrl } = req.body;

    let finalImageUrl = '';

    if (req.file) {
      // Local multipart file upload
      finalImageUrl = `/uploads/${req.file.filename}`;
    } else if (directUrl && directUrl.trim() !== '') {
      // Direct remote image URL (e.g., Unsplash)
      finalImageUrl = directUrl.trim();
    } else {
      return res.status(400).json({
        success: false,
        message: 'Please provide either a direct image URL or upload an image file',
      });
    }

    if (!title) {
      return res.status(400).json({ success: false, message: 'Title is required' });
    }

    const photo = await Photo.create({
      title,
      description: description || '',
      category: category || 'Nature',
      imageUrl: finalImageUrl,
      uploadedBy: req.user._id,
    });

    const populated = await Photo.findById(photo._id).populate('uploadedBy', 'name email role');

    res.status(201).json({
      success: true,
      message: 'Photo published successfully',
      photo: populated,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete a photo
// @route   DELETE /api/photos/:id
// @access  Admin only
const deletePhoto = async (req, res) => {
  try {
    const photo = await Photo.findById(req.params.id);

    if (!photo) {
      return res.status(404).json({ success: false, message: 'Photo not found' });
    }

    // Clean up local uploaded file if applicable
    if (photo.imageUrl && photo.imageUrl.startsWith('/uploads/')) {
      const filename = photo.imageUrl.replace('/uploads/', '');
      const filePath = path.join(__dirname, '..', 'uploads', filename);
      if (fs.existsSync(filePath)) {
        try {
          fs.unlinkSync(filePath);
        } catch (e) {
          console.warn('Could not remove file from disk:', e.message);
        }
      }
    }

    // Remove photo reference from any users favorites
    await User.updateMany(
      { favorites: photo._id },
      { $pull: { favorites: photo._id } }
    );

    await Photo.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Photo deleted successfully',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getPhotos,
  getPhotoById,
  createPhoto,
  deletePhoto,
};
