const { Appointment, User, Institution } = require('../models');
const { auth, checkRole } = require('../middleware/auth');
const { Op } = require('sequelize');

// Kurum için randevu oluşturma
const createAppointment = async (req, res) => {
    try {
        const { date, timeSlot, description, maxParticipants } = req.body;
        const institutionId = req.user.institutionId;

        const appointment = await Appointment.create({
            institutionId,
            date,
            timeSlot,
            description,
            maxParticipants,
            status: 'available'
        });

        res.status(201).json({
            success: true,
            data: appointment
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};

// Kurumun randevularını listeleme
const getInstitutionAppointments = async (req, res) => {
    try {
        const institutionId = req.user.institutionId;
        const appointments = await Appointment.findAll({
            where: { institutionId },
            include: [{
                model: User,
                attributes: ['id', 'name', 'email']
            }]
        });

        res.status(200).json({
            success: true,
            data: appointments
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};

// Kullanıcı için randevu alma
const bookAppointment = async (req, res) => {
    try {
        const { appointmentId } = req.params;
        const userId = req.user.id;

        const appointment = await Appointment.findByPk(appointmentId);

        if (!appointment) {
            return res.status(404).json({
                success: false,
                error: 'Randevu bulunamadı'
            });
        }

        if (appointment.status !== 'available') {
            return res.status(400).json({
                success: false,
                error: 'Bu randevu müsait değil'
            });
        }

        if (appointment.currentParticipants >= appointment.maxParticipants) {
            return res.status(400).json({
                success: false,
                error: 'Randevu kontenjanı dolu'
            });
        }

        appointment.userId = userId;
        appointment.currentParticipants += 1;
        appointment.status = appointment.currentParticipants >= appointment.maxParticipants ? 'booked' : 'available';
        await appointment.save();

        res.status(200).json({
            success: true,
            data: appointment
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};

// Kullanıcının randevularını listeleme
const getUserAppointments = async (req, res) => {
    try {
        const userId = req.user.id;
        const appointments = await Appointment.findAll({
            where: { userId },
            include: [{
                model: Institution,
                attributes: ['id', 'name', 'address']
            }]
        });

        res.status(200).json({
            success: true,
            data: appointments
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};

// Müsait randevuları listeleme
const getAvailableAppointments = async (req, res) => {
    try {
        const appointments = await Appointment.findAll({
            where: { status: 'available' },
            include: [{
                model: Institution,
                attributes: ['id', 'name', 'address']
            }]
        });

        res.status(200).json({
            success: true,
            data: appointments
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};

// Randevu Güncelleme
const updateAppointment = async (req, res) => {
    try {
        const { appointmentId } = req.params;
        const { date, time, serviceType, notes } = req.body;

        const appointment = await Appointment.findOne({
            where: {
                id: appointmentId,
                userId: req.user.id
            }
        });

        if (!appointment) {
            return res.status(404).json({ message: 'Randevu bulunamadı' });
        }

        // Randevu çakışması kontrolü
        if (date && time) {
            const existingAppointment = await Appointment.findOne({
                where: {
                    institutionId: appointment.institutionId,
                    date,
                    time,
                    status: ['pending', 'confirmed'],
                    id: { [Op.ne]: appointmentId }
                }
            });

            if (existingAppointment) {
                return res.status(400).json({ message: 'Bu saat için randevu dolu' });
            }
        }

        await appointment.update({
            date: date || appointment.date,
            time: time || appointment.time,
            serviceType: serviceType || appointment.serviceType,
            notes: notes || appointment.notes
        });

        res.json({
            message: 'Randevu başarıyla güncellendi',
            appointment
        });
    } catch (error) {
        console.error('Randevu güncelleme hatası:', error);
        res.status(500).json({ message: 'Sunucu hatası' });
    }
};

// Randevu İptali
const cancelAppointment = async (req, res) => {
    try {
        const { appointmentId } = req.params;

        const appointment = await Appointment.findOne({
            where: {
                id: appointmentId,
                userId: req.user.id
            }
        });

        if (!appointment) {
            return res.status(404).json({ message: 'Randevu bulunamadı' });
        }

        await appointment.update({ status: 'cancelled' });

        res.json({
            message: 'Randevu başarıyla iptal edildi',
            appointment
        });
    } catch (error) {
        console.error('Randevu iptal hatası:', error);
        res.status(500).json({ message: 'Sunucu hatası' });
    }
};

// Randevu Onaylama (Kurum için)
const confirmAppointment = async (req, res) => {
    try {
        const { appointmentId } = req.params;

        const appointment = await Appointment.findOne({
            where: {
                id: appointmentId,
                institutionId: req.user.institution.id
            }
        });

        if (!appointment) {
            return res.status(404).json({ message: 'Randevu bulunamadı' });
        }

        await appointment.update({ status: 'confirmed' });

        res.json({
            message: 'Randevu başarıyla onaylandı',
            appointment
        });
    } catch (error) {
        console.error('Randevu onaylama hatası:', error);
        res.status(500).json({ message: 'Sunucu hatası' });
    }
};

// Randevu Arama ve Filtreleme
const searchAppointments = async (req, res) => {
    try {
        const {
            institutionId,
            date,
            serviceType,
            status,
            startDate,
            endDate,
            page = 1,
            limit = 10
        } = req.query;

        const whereClause = {};

        if (institutionId) {
            whereClause.institutionId = institutionId;
        }

        if (date) {
            whereClause.date = date;
        }

        if (serviceType) {
            whereClause.serviceType = serviceType;
        }

        if (status) {
            whereClause.status = status;
        }

        if (startDate && endDate) {
            whereClause.date = {
                [Op.between]: [startDate, endDate]
            };
        }

        const offset = (page - 1) * limit;

        const appointments = await Appointment.findAndCountAll({
            where: whereClause,
            include: [
                {
                    model: User,
                    as: 'user',
                    attributes: ['firstName', 'lastName', 'email', 'phoneNumber']
                },
                {
                    model: Institution,
                    as: 'institution',
                    attributes: ['institutionName', 'institutionAddress', 'city', 'district']
                }
            ],
            order: [['date', 'ASC'], ['time', 'ASC']],
            limit: parseInt(limit),
            offset: offset
        });

        res.json({
            appointments: appointments.rows,
            total: appointments.count,
            currentPage: parseInt(page),
            totalPages: Math.ceil(appointments.count / limit)
        });
    } catch (error) {
        console.error('Randevu arama hatası:', error);
        res.status(500).json({ message: 'Sunucu hatası' });
    }
};

module.exports = {
    createAppointment,
    updateAppointment,
    cancelAppointment,
    confirmAppointment,
    getUserAppointments,
    getInstitutionAppointments,
    searchAppointments,
    bookAppointment,
    getAvailableAppointments
}; 