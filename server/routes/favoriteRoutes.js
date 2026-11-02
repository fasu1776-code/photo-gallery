const express = require('express');
const router = express.Router();
const { getFavorites, toggleFavorite } = require('../controllers/favoriteController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .get(protect, getFavorites);

router.route('/:photoId')
  .post(protect, toggleFavorite);

module.exports = router;
