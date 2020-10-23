const express = require('express');
const profileController = require('../controllers/profileController');
const { isAuth } = require('../middleware/isAuth');
const router = express.Router();

router.post('/upload', isAuth, profileController.upload_image);
router.get('/:id/posts/',isAuth, profileController.get_posts);
router.get('/:id', profileController.get_user_profile);

module.exports = router;