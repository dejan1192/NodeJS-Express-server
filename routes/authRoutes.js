const express = require('express');
const authController = require('../controllers/authController');
const { isAuth } = require('../middleware/isAuth');
const router = express.Router();

router.get('/',isAuth, authController.get_user);
router.post('/login', authController.post_login);
router.post('/register', authController.post_register);
router.get('/logout',isAuth, authController.get_logout);

module.exports = router;