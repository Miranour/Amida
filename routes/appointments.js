const express = require('express');
const router = express.Router();
const { Appointment, Institution, InstitutionService, InstitutionEmployee, User } = require('../models');
const { auth } = require('../middleware/auth');
const { createAppointment } = require('../controllers/appointmentController');

// Kurum için randevu oluşturma
router.post('/institutions/:institutionId/appointments', auth, createAppointment);

// Kurumun randevularını listeleme
router.get('/institutions/:institutionId/appointments', auth, (req, res) => {
    const { institutionId } = req.params;

    Appointment.findAll({
        where: { institutionId },
        include: [
            {
                model: InstitutionService,
                as: 'service'
            },
            {
                model: InstitutionEmployee,
                as: 'employee'
            },
            {
                model: User,
                as: 'user'
            }
        ],
        order: [['date', 'ASC'], ['timeSlot', 'ASC']]
    })
        .then(appointments => {
            res.json(appointments);
        })
        .catch(error => {
            console.error('Randevu listeleme hatası:', error);
            res.status(500).json({ message: 'Randevular listelenirken bir hata oluştu' });
        });
});

// Müsait randevuları listeleme
router.get('/available', auth, (req, res) => {
    Appointment.findAll({
        where: { status: 'available' },
        include: [
            {
                model: Institution,
                as: 'institution'
            },
            {
                model: InstitutionService,
                as: 'service'
            },
            {
                model: InstitutionEmployee,
                as: 'employee'
            }
        ],
        order: [['date', 'ASC'], ['timeSlot', 'ASC']]
    })
        .then(appointments => {
            res.json(appointments);
        })
        .catch(error => {
            console.error('Müsait randevu listeleme hatası:', error);
            res.status(500).json({ message: 'Randevular listelenirken bir hata oluştu' });
        });
});

// Kurumun onay bekleyen randevularını listeleme
router.get('/institutions/:institutionId/requests', auth, (req, res) => {
    const { institutionId } = req.params;
    Appointment.findAll({
        where: { institutionId, status: 'booked' },
        include: [
            { model: InstitutionService, as: 'service' },
            { model: InstitutionEmployee, as: 'employee' },
            { model: User, as: 'user' }
        ],
        order: [['date', 'ASC'], ['timeSlot', 'ASC']]
    })
        .then(appointments => {
            res.json(appointments);
        })
        .catch(error => {
            console.error('Onay bekleyen randevular listelenirken hata:', error);
            res.status(500).json({ message: 'Onay bekleyen randevular listelenirken hata oluştu' });
        });
});

// Randevu alma
router.post('/:appointmentId/book', auth, (req, res) => {
    const { appointmentId } = req.params;
    const { userId } = req.body;

    Appointment.findByPk(appointmentId)
        .then(appointment => {
            if (!appointment) {
                return res.status(404).json({ message: 'Randevu bulunamadı' });
            }

            if (appointment.status !== 'available') {
                return res.status(400).json({ message: 'Bu randevu müsait değil' });
            }

            appointment.status = 'booked';
            appointment.userId = userId;
            return appointment.save();
        })
        .then(appointment => {
            res.json(appointment);
        })
        .catch(error => {
            console.error('Randevu alma hatası:', error);
            res.status(500).json({ message: 'Randevu alınırken bir hata oluştu' });
        });
});

// Randevu onayla
router.post('/:appointmentId/approve', auth, (req, res) => {
    const { appointmentId } = req.params;
    Appointment.findByPk(appointmentId)
        .then(appointment => {
            if (!appointment) {
                return res.status(404).json({ message: 'Randevu bulunamadı' });
            }
            if (appointment.status !== 'booked') {
                return res.status(400).json({ message: 'Sadece bekleyen randevu onaylanabilir' });
            }
            appointment.status = 'approved';
            return appointment.save();
        })
        .then(appointment => {
            res.json(appointment);
        })
        .catch(error => {
            console.error('Randevu onaylama hatası:', error);
            res.status(500).json({ message: 'Randevu onaylanırken hata oluştu' });
        });
});

// Randevu reddet
router.post('/:appointmentId/reject', auth, (req, res) => {
    const { appointmentId } = req.params;
    Appointment.findByPk(appointmentId)
        .then(appointment => {
            if (!appointment) {
                return res.status(404).json({ message: 'Randevu bulunamadı' });
            }
            if (appointment.status !== 'booked') {
                return res.status(400).json({ message: 'Sadece bekleyen randevu reddedilebilir' });
            }
            appointment.status = 'rejected';
            return appointment.save();
        })
        .then(appointment => {
            res.json(appointment);
        })
        .catch(error => {
            console.error('Randevu reddetme hatası:', error);
            res.status(500).json({ message: 'Randevu reddedilirken hata oluştu' });
        });
});

module.exports = router; 