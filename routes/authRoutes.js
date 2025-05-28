const express = require('express');
const router = express.Router();
const { register, login, updateProfile } = require('../controllers/authController');
const { auth } = require('../middleware/auth');

// Kullanıcı kaydı
router.post('/register', register);

// Kullanıcı girişi
router.post('/login', login);

// Kullanıcı profilini güncelleme
router.put('/update', auth, updateProfile);

module.exports = router; 