const express = require('express');
const router = express.Router();
const { auth, checkRole } = require('../middleware/auth');
const {
    createAppointment,
    createCustomerAppointment,
    updateAppointment,
    cancelAppointment,
    confirmAppointment,
    getUserAppointments,
    getInstitutionAppointments,
    searchAppointments,
    getAvailableAppointments,
    bookAppointment
} = require('../controllers/appointmentController');

// Kurum için randevu rotaları
router.post('/institution', auth, checkRole(['institution']), createAppointment);
router.get('/institution/list', auth, checkRole(['institution']), getInstitutionAppointments);

// Kullanıcı için randevu rotaları
router.get('/available', auth, getAvailableAppointments);
router.post('/book/:appointmentId', auth, checkRole(['user']), bookAppointment);
router.get('/user/list', auth, checkRole(['user']), getUserAppointments);

// Yeni dinamik randevu oluşturma
router.post('/create', auth, checkRole(['user']), createCustomerAppointment);

// Randevu güncelleme (Kullanıcı için)
router.put('/update/:appointmentId', auth, updateAppointment);

// Randevu iptali (Kullanıcı için)
router.put('/cancel/:appointmentId', auth, cancelAppointment);

// Randevu onaylama (Kurum için)
router.put('/confirm/:appointmentId', auth, checkRole(['institution']), confirmAppointment);

// Randevu arama ve filtreleme
router.get('/search', auth, searchAppointments);

module.exports = router; 