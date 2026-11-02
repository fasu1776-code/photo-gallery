const User = require('../models/User');
const Photo = require('../models/Photo');

// @desc    Get current user's favorite photos
// @route   GET /api/favorites
// @access  Protected
const getFavorites = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate({
      path: 'favorites',
      populate: {
        path: 'uploadedBy',
        select: 'name email role',
      },
    });

    res.json({
      success: true,
      favorites: user.favorites || [],
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Toggle photo favorite status
// @route   POST /api/favorites/:photoId
// @access  Protected
const toggleFavorite = async (req, res) => {
  try {
    const { photoId } = req.params;
    const photo = await Photo.findById(photoId);

    if (!photo) {
      return res.status(404).json({ success: false, message: 'Photo not found' });
    }

    const user = await User.findById(req.user._id);
    const isFavorited = user.favorites.some((fav) => fav.toString() === photoId);

    if (isFavorited) {
      user.favorites = user.favorites.filter((fav) => fav.toString() !== photoId);
      await user.save();
      return res.json({
        success: true,
        message: 'Removed from favorites',
        isFavorite: false,
        favorites: user.favorites,
      });
    } else {
      user.favorites.push(photoId);
      await user.save();
      return res.json({
        success: true,
        message: 'Added to favorites',
        isFavorite: true,
        favorites: user.favorites,
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getFavorites,
  toggleFavorite,
};
