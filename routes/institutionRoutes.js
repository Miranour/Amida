const express = require('express');
const router = express.Router();
const { auth, checkRole } = require('../middleware/auth');
const { upload, photoUpload } = require('../config/upload');
const {
    registerInstitution,
    updateInstitution,
    getInstitution,
    getAllInstitutions,
    verifyInstitution,
    publicRegisterInstitution,
    updateInstitutionSettings,
    uploadLogo,
    uploadPhotos,
    getInstitutionDashboard,
    getInstitutionCustomers
} = require('../controllers/institutionController');

// Kurum kaydı (Kullanıcı için)
router.post('/register', auth, registerInstitution);

// Kurum bilgilerini güncelleme (Kurum için)
router.put('/update', auth, checkRole(['institution']), updateInstitution);

// Kurum bilgilerini getirme (Kurum için)
router.get('/profile', auth, checkRole(['institution']), getInstitution);

// Tüm kurumları listeleme (Admin için)
router.get('/all', auth, checkRole(['admin']), getAllInstitutions);

// Kurum doğrulama (Admin için)
router.put('/verify/:institutionId', auth, checkRole(['admin']), verifyInstitution);

// Kurum ve sorumlu kaydı (public)
router.post('/public-register', publicRegisterInstitution);

// Kurum ayarlarını güncelleme (Kurum için)
router.put('/settings', auth, checkRole(['institution']), updateInstitutionSettings);

// Logo yükleme route'u
router.post('/upload-logo', auth, upload.single('logo'), uploadLogo);

// Fotoğraf yükleme route'u
router.post('/upload-photos', auth, photoUpload.array('photos', 10), uploadPhotos);

// Dashboard verisi
router.get('/dashboard', auth, getInstitutionDashboard);

// Kurumun müşterilerini listele
router.get('/customers', auth, checkRole(['institution']), getInstitutionCustomers);

// Popüler kurumlar (dummy veri)
router.get('/popular', (req, res) => {
  res.json([
    // Örnek veri, istersen boş dizi de dönebilirsin
    { id: 1, institutionName: "Popüler Kurum 1" },
    { id: 2, institutionName: "Popüler Kurum 2" }
  ]);
});

// Şehirler (dummy veri)
router.get('/cities', (req, res) => {
  res.json([
    "İstanbul",
    "Ankara",
    "İzmir"
  ]);
});

module.exports = router; 