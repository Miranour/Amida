const { Institution, User } = require('../models');
const { auth, checkRole } = require('../middleware/auth');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
// const { cloudinary } = require('../config/cloudinary'); // Artık kullanılmıyor
const fs = require('fs').promises;
const path = require('path');
const { Appointment } = require('../models');
const { sequelize } = require('../models');
const { Op } = require('sequelize');

// Kurum Kaydı
const registerInstitution = async (req, res) => {
    try {
        const {
            institutionName,
            taxNumber,
            institutionPhone,
            institutionEmail,
            institutionAddress,
            city,
            district,
            institutionType,
            workingHours
        } = req.body;

        // Vergi numarası kontrolü
        const existingInstitution = await Institution.findOne({ where: { taxNumber } });
        if (existingInstitution) {
            return res.status(400).json({ message: 'Bu vergi numarası zaten kayıtlı' });
        }

        // Kullanıcı rolünü güncelle
        await User.update(
            { role: 'institution' },
            { where: { id: req.user.id } }
        );

        // Kurum oluşturma
        const institution = await Institution.create({
            userId: req.user.id,
            institutionName,
            taxNumber,
            institutionPhone,
            institutionEmail,
            institutionAddress,
            city,
            district,
            institutionType,
            workingHours: JSON.parse(workingHours),
            isVerified: false
        });

        res.status(201).json({
            message: 'Kurum başarıyla oluşturuldu',
            institution
        });
    } catch (error) {
        console.error('Kurum kayıt hatası:', error);
        res.status(500).json({ message: 'Sunucu hatası' });
    }
};

// Kurum Bilgilerini Güncelleme
const updateInstitution = async (req, res) => {
    try {
        const {
            institutionName,
            institutionPhone,
            institutionEmail,
            institutionAddress,
            city,
            district,
            institutionType,
            workingHours
        } = req.body;

        const institution = await Institution.findOne({ where: { userId: req.user.id } });
        if (!institution) {
            return res.status(404).json({ message: 'Kurum bulunamadı' });
        }

        await institution.update({
            institutionName,
            institutionPhone,
            institutionEmail,
            institutionAddress,
            city,
            district,
            institutionType,
            workingHours: JSON.parse(workingHours)
        });

        res.json({
            message: 'Kurum bilgileri güncellendi',
            institution
        });
    } catch (error) {
        console.error('Kurum güncelleme hatası:', error);
        res.status(500).json({ message: 'Sunucu hatası' });
    }
};

// Kurum Bilgilerini Getirme
const getInstitution = async (req, res) => {
    try {
        const institution = await Institution.findOne({ 
            where: { userId: req.user.id },
            include: [{
                model: User,
                as: 'user',
                attributes: ['firstName', 'lastName', 'email', 'phoneNumber']
            }]
        });

        if (!institution) {
            return res.status(404).json({ message: 'Kurum bulunamadı' });
        }

        res.json(institution);
    } catch (error) {
        console.error('Kurum bilgileri getirme hatası:', error);
        res.status(500).json({ message: 'Sunucu hatası' });
    }
};

// Tüm Kurumları Listeleme (Admin için)
const getAllInstitutions = async (req, res) => {
    try {
        const institutions = await Institution.findAll({
            include: [{
                model: User,
                as: 'user',
                attributes: ['firstName', 'lastName', 'email', 'phoneNumber']
            }]
        });

        res.json(institutions);
    } catch (error) {
        console.error('Kurum listesi getirme hatası:', error);
        res.status(500).json({ message: 'Sunucu hatası' });
    }
};

// Kurum Doğrulama (Admin için)
const verifyInstitution = async (req, res) => {
    try {
        const { institutionId } = req.params;

        const institution = await Institution.findByPk(institutionId);
        if (!institution) {
            return res.status(404).json({ message: 'Kurum bulunamadı' });
        }

        await institution.update({ isVerified: true });

        res.json({
            message: 'Kurum başarıyla doğrulandı',
            institution
        });
    } catch (error) {
        console.error('Kurum doğrulama hatası:', error);
        res.status(500).json({ message: 'Sunucu hatası' });
    }
};

// Kurum ve sorumlu kaydı (public)
const publicRegisterInstitution = async (req, res) => {
    try {
        const {
            firstName,
            lastName,
            email,
            password,
            phoneNumber,
            birthDate,
            address,
            city,
            district,
            institutionName,
            taxNumber,
            institutionPhone,
            institutionEmail,
            institutionAddress,
            institutionType,
            workingHours
        } = req.body;

        // E-posta kontrolü
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ 
                message: 'Bu e-posta adresi zaten kullanımda',
                field: 'email'
            });
        }

        // Telefon numarası kontrolü
        const existingPhone = await User.findOne({ where: { phoneNumber } });
        if (existingPhone) {
            return res.status(400).json({ 
                message: 'Bu telefon numarası zaten kullanımda',
                field: 'phoneNumber'
            });
        }

        // Vergi numarası kontrolü
        const existingInstitution = await Institution.findOne({ where: { taxNumber } });
        if (existingInstitution) {
            return res.status(400).json({ 
                message: 'Bu vergi numarası zaten kayıtlı',
                field: 'taxNumber'
            });
        }

        // Kurum e-posta kontrolü
        const existingInstitutionEmail = await Institution.findOne({ where: { institutionEmail } });
        if (existingInstitutionEmail) {
            return res.status(400).json({ 
                message: 'Bu kurum e-posta adresi zaten kullanımda',
                field: 'institutionEmail'
            });
        }

        // Şifre hashleme
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Sorumlu kullanıcıyı oluştur
        const user = await User.create({
            firstName,
            lastName,
            email,
            phoneNumber,
            password: hashedPassword,
            birthDate,
            address,
            city,
            district,
            role: 'institution'
        });

        // Kurumu oluştur
        const institution = await Institution.create({
            userId: user.id,
            institutionName,
            taxNumber,
            institutionPhone,
            institutionEmail,
            institutionAddress,
            city,
            district,
            institutionType,
            workingHours: workingHours ? JSON.parse(workingHours) : {},
            isVerified: false
        });

        // JWT token oluştur
        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            process.env.JWT_SECRET || 'gizli_anahtar',
            { expiresIn: '24h' }
        );

        res.status(201).json({
            message: 'Kurum ve sorumlu başarıyla oluşturuldu',
            token,
            user: {
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                role: user.role
            },
            institution
        });
    } catch (error) {
        console.error('Public kurum kayıt hatası:', error);
        res.status(500).json({ 
            message: 'Kurum kaydı sırasında bir hata oluştu',
            details: error.message
        });
    }
};

// Kurum Ayarlarını Güncelleme
const updateInstitutionSettings = async (req, res) => {
    try {
        const {
            logo,
            description,
            website,
            socialMedia,
            appointmentDuration,
            maxAppointmentsPerDay,
            breakTime,
            holidays,
            notificationSettings,
            emailNotifications,
            smsNotifications
        } = req.body;

        const institution = await Institution.findOne({ where: { userId: req.user.id } });
        if (!institution) {
            return res.status(404).json({ message: 'Kurum bulunamadı' });
        }

        const websiteToSave = website && website.trim() !== '' ? website : null;
        const socialMediaToSave = typeof socialMedia === 'string' ? (socialMedia.trim() !== '' ? JSON.parse(socialMedia) : null) : socialMedia;
        const breakTimeToSave = typeof breakTime === 'string' ? (breakTime.trim() !== '' ? JSON.parse(breakTime) : null) : breakTime;
        const holidaysToSave = typeof holidays === 'string' ? (holidays.trim() !== '' ? JSON.parse(holidays) : null) : holidays;
        const notificationSettingsToSave = typeof notificationSettings === 'string' ? (notificationSettings.trim() !== '' ? JSON.parse(notificationSettings) : null) : notificationSettings;
        const emailNotificationsToSave = typeof emailNotifications === 'string' ? (emailNotifications.trim() !== '' ? JSON.parse(emailNotifications) : null) : emailNotifications;
        const smsNotificationsToSave = typeof smsNotifications === 'string' ? (smsNotifications.trim() !== '' ? JSON.parse(smsNotifications) : null) : smsNotifications;

        await institution.update({
            logo,
            description,
            website: websiteToSave,
            socialMedia: socialMediaToSave,
            appointmentDuration,
            maxAppointmentsPerDay,
            breakTime: breakTimeToSave,
            holidays: holidaysToSave,
            notificationSettings: notificationSettingsToSave,
            emailNotifications: emailNotificationsToSave,
            smsNotifications: smsNotificationsToSave
        });

        res.json({
            message: 'Kurum ayarları güncellendi',
            institution
        });
    } catch (error) {
        console.error('Kurum ayarları güncelleme hatası:', error);
        res.status(500).json({ message: 'Sunucu hatası', details: error.message });
    }
};

// Logo Yükleme
const uploadLogo = async (req, res) => {
    try {
        console.log('Logo yükleme isteği başladı');
        console.log('Request file:', req.file);
        
        if (!req.file) {
            console.log('Dosya yüklenmedi');
            return res.status(400).json({ message: 'Lütfen bir logo dosyası yükleyin' });
        }

        const institution = await Institution.findOne({ where: { userId: req.user.id } });
        if (!institution) {
            console.log('Kurum bulunamadı, userId:', req.user.id);
            return res.status(404).json({ message: 'Kurum bulunamadı' });
        }

        console.log('Mevcut logo:', institution.logo);

        // Eski logoyu sil
        if (institution.logo) {
            const oldLogoPath = path.join(__dirname, '..', 'public', institution.logo);
            console.log('Eski logo yolu:', oldLogoPath);
            try {
                await fs.unlink(oldLogoPath);
                console.log('Eski logo başarıyla silindi');
            } catch (error) {
                console.error('Eski logo silinirken hata:', error);
            }
        }

        // Yeni logo URL'sini kaydet
        const logoPath = `/uploads/logos/${req.file.filename}`;
        console.log('Yeni logo yolu:', logoPath);
        
        await institution.update({
            logo: logoPath
        });
        console.log('Logo veritabanında güncellendi');

        res.json({
            message: 'Logo başarıyla güncellendi',
            logoUrl: logoPath
        });
    } catch (error) {
        console.error('Logo yükleme hatası:', error);
        console.error('Hata detayları:', {
            message: error.message,
            stack: error.stack
        });
        res.status(500).json({ 
            message: 'Sunucu hatası', 
            details: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
};

// İşyeri Fotoğrafları Yükleme
const uploadPhotos = async (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: 'Lütfen en az bir fotoğraf yükleyin' });
        }

        const institution = await Institution.findOne({ where: { userId: req.user.id } });
        if (!institution) {
            return res.status(404).json({ message: 'Kurum bulunamadı' });
        }

        // Fotoğraf yollarını oluştur
        const photoPaths = req.files.map(file => `/uploads/photos/${file.filename}`);

        // (İsteğe bağlı) Fotoğrafları veritabanında saklamak için aşağıdaki satırı açabilirsin:
        // await institution.update({ photos: photoPaths });

        res.json({
            message: 'Fotoğraflar başarıyla yüklendi',
            photos: photoPaths
        });
    } catch (error) {
        console.error('Fotoğraf yükleme hatası:', error);
        res.status(500).json({ message: 'Sunucu hatası', details: error.message });
    }
};

// Kurum Paneli Dashboard Verisi
const getInstitutionDashboard = async (req, res) => {
    try {
        const userId = req.user.id;
        const institution = await Institution.findOne({ where: { userId } });
        if (!institution) {
            return res.status(404).json({ message: 'Kurum bulunamadı' });
        }

        // Kullanıcı bilgisi
        const user = await User.findByPk(userId);

        // Geçici olarak sadece kullanıcı ve kurum bilgisini döndür
        res.json({
            user: { name: user.firstName + ' ' + user.lastName, lastLogin: user.updatedAt },
            // Diğer veriler geçici olarak boş veya varsayılan
            todaysAppointments: [],
            pendingAppointments: 0,
            cancelRequests: 0,
            stats: {
                totalAppointments: 0,
                weekAppointments: 0,
                topService: '-'
            },
            upcomingAppointments: [],
            notifications: [], // Örnek statik veriyi burada tutabiliriz isterseniz
            logs: [] // Örnek statik veriyi burada tutabiliriz isterseniz
        });

        // Orijinal kod (geçici olarak yorum satırı yapıldı)
        /*
        // Bugünün tarihi
        const today = new Date();
        const todayStr = today.toISOString().split('T')[0];

        // Randevu modelleri ve ilişkiler projede varsa eklenmeli
        const { Appointment } = require('../models');

        // Bugünün randevuları
        const todaysAppointments = await Appointment.findAll({
            where: {
                institutionId: institution.id,
                date: todayStr
            },
            include: [{ model: User, as: 'user', attributes: ['firstName', 'lastName'] }]
        });

        // Bekleyen işlemler
        const pendingAppointments = await Appointment.count({ where: { institutionId: institution.id, status: 'pending' } });
        const cancelRequests = 0; // Geçici olarak sabit değer verildi

        // İstatistikler
        const totalAppointments = await Appointment.count({ where: { institutionId: institution.id } });
        const weekStart = new Date(today); weekStart.setDate(today.getDate() - today.getDay());
        const weekEnd = new Date(weekStart); weekEnd.setDate(weekStart.getDate() + 6);
        const weekAppointments = await Appointment.count({
            where: {
                institutionId: institution.id,
                date: { [Op.between]: [weekStart.toISOString().split('T')[0], weekEnd.toISOString().split('T')[0]] }
            }
        });
        // En çok tercih edilen hizmet (örnek)
        // const topService = await Appointment.findAll({
        //     where: { institutionId: institution.id },
        //     attributes: ['serviceType', [sequelize.fn('COUNT', sequelize.col('serviceType')), 'count']],
        //     group: ['serviceType'],
        //     order: [[sequelize.literal('count'), 'DESC']],
        //     limit: 1
        // });

        // Geçici olarak en çok tercih edilen hizmet değeri
        const topService = [{ serviceType: 'Veri Yok veya Hata' }];

        // Yaklaşan randevular (bugünden sonrası)
        const upcomingAppointments = await Appointment.findAll({
            where: {
                institutionId: institution.id,
                date: { [Op.gte]: todayStr }
            },
            order: [['date', 'ASC'], ['time', 'ASC']],
            limit: 5,
            include: [{ model: User, as: 'user', attributes: ['firstName', 'lastName'] }]
        });

        // Sistem mesajları ve loglar (örnek statik, istersen modele ekleyebilirsin)
        const notifications = [
            { id: 1, message: 'Sistem güncellemesi yapılacaktır.', date: '2024-05-12' },
            { id: 2, message: 'Yeni müşteri kaydı eklendi.', date: '2024-05-11' },
        ];
        const logs = [
            { id: 1, action: 'Randevu oluşturuldu', date: '2024-05-13 09:30' },
            { id: 2, action: 'Randevu onaylandı', date: '2024-05-13 09:35' },
        ];

        res.json({
            user: { name: user.firstName + ' ' + user.lastName, lastLogin: user.updatedAt },
            todaysAppointments,
            pendingAppointments,
            cancelRequests,
            stats: {
                totalAppointments,
                weekAppointments,
                topService: topService[0]?.serviceType
            },
            upcomingAppointments,
            notifications,
            logs
        });
        */
    } catch (error) {
        console.error('Dashboard verisi hatası:', error);
        res.status(500).json({ message: 'Sunucu hatası', details: error.message });
    }
};

module.exports = {
    registerInstitution,
    updateInstitution,
    getInstitution,
    getAllInstitutions,
    verifyInstitution,
    publicRegisterInstitution,
    updateInstitutionSettings,
    uploadLogo,
    uploadPhotos,
    getInstitutionDashboard
}; 