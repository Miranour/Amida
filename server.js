const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');
const { User, Institution, Appointment } = require('./models');
const authRoutes = require('./routes/authRoutes');
const institutionRoutes = require('./routes/institutionRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');
require('dotenv').config();

const app = express();

// Statik dosya sunumu (logo ve diğer yüklenen dosyalar için)
app.use('/uploads', express.static('public/uploads'));

// Middleware
const corsOptions = {
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};
app.use(cors(corsOptions));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/institutions', institutionRoutes);
app.use('/api/appointments', appointmentRoutes);

// PostgreSQL bağlantısı ve tablo oluşturma
const initializeDatabase = async () => {
    try {
        await sequelize.authenticate();
        console.log('PostgreSQL bağlantısı başarılı');

        // Tabloları oluştur
        await User.sync();
        console.log('Users tablosu oluşturuldu');

        await Institution.sync();
        console.log('Institutions tablosu oluşturuldu');

        await Appointment.sync();
        console.log('Appointments tablosu oluşturuldu');

        // İlişkileri senkronize et
        await sequelize.sync();
        console.log('Tüm tablolar ve ilişkiler başarıyla oluşturuldu');

        // Örnek admin kullanıcısı oluştur
        const adminExists = await User.findOne({ where: { email: 'admin@amida.com' } });
        if (!adminExists) {
            await User.create({
                firstName: 'Admin',
                lastName: 'User',
                email: 'admin@amida.com',
                phoneNumber: '5551234567',
                password: '$2a$10$XKQvz8Uq8Uq8Uq8Uq8Uq8O', // Şifre: admin123
                birthDate: '1990-01-01',
                address: 'Admin Adresi',
                city: 'İstanbul',
                district: 'Kadıköy',
                role: 'admin',
                isActive: true
            });
            console.log('Örnek admin kullanıcısı oluşturuldu');
        } else {
            console.log('Admin kullanıcısı zaten mevcut, tekrar eklenmedi');
        }

    } catch (error) {
        console.error('Veritabanı başlatma hatası:', error);
    }
};

initializeDatabase();

// Ana route
app.get('/', (req, res) => {
    res.json({ message: 'Amida Randevu Sistemi API' });
});

// Sunucu başlatma
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Sunucu ${PORT} portunda çalışıyor`);
}); 