const express = require('express');
const router = express.Router();
const {
  getPhotos,
  getPhotoById,
  createPhoto,
  deletePhoto,
} = require('../controllers/photoController');
const { protect, adminOnly } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.route('/')
  .get(getPhotos)
  .post(protect, adminOnly, upload.single('image'), createPhoto);

router.route('/:id')
  .get(getPhotoById)
  .delete(protect, adminOnly, deletePhoto);

module.exports = router;
