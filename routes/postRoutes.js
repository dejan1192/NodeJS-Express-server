const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const { isAuth } = require('../middleware/isAuth');

router.get('/posts', postController.get_posts);
router.get('/posts/:id', isAuth, postController.get_post);
router.post('/posts', isAuth, postController.create_post);
router.delete('/posts/:id', isAuth, postController.delete_post);

module.exports = router;
