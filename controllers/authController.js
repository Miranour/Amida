const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models');

// Kullanıcı Kaydı
const register = async (req, res) => {
    try {
        const {
            firstName,
            lastName,
            email,
            phoneNumber,
            password,
            birthDate,
            address,
            city,
            district
        } = req.body;

        // E-posta kontrolü
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: 'Bu e-posta adresi zaten kullanımda' });
        }

        // Şifre hashleme
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Kullanıcı oluşturma
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
            role: 'user'
        });

        // JWT token oluşturma
        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            process.env.JWT_SECRET || 'gizli_anahtar',
            { expiresIn: '24h' }
        );

        res.status(201).json({
            message: 'Kullanıcı başarıyla oluşturuldu',
            token,
            user: {
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Kayıt hatası:', error);
        res.status(500).json({ message: 'Sunucu hatası' });
    }
};

// Kullanıcı Girişi
const login = async (req, res) => {
    try {
        const { email, password, role } = req.body;

        // Kullanıcı kontrolü
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(401).json({ 
                message: 'Bu e-posta adresi ile kayıtlı bir kullanıcı bulunamadı',
                field: 'email'
            });
        }

        // Şifre kontrolü
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).json({ 
                message: 'Girdiğiniz şifre hatalı',
                field: 'password'
            });
        }

        // Rol kontrolü
        if (role && user.role !== role) {
            return res.status(403).json({ 
                message: 'Bu giriş ekranı için yetkiniz yok. Lütfen doğru giriş sayfasını kullanın.',
                field: 'role'
            });
        }

        // JWT token oluşturma
        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            process.env.JWT_SECRET || 'gizli_anahtar',
            { expiresIn: '24h' }
        );

        res.json({
            message: 'Giriş başarılı',
            token,
            user: {
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Giriş hatası:', error);
        res.status(500).json({ 
            message: 'Giriş yapılırken bir hata oluştu',
            details: error.message
        });
    }
};

// Kullanıcı Profilini Güncelleme
const updateProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const {
            firstName,
            lastName,
            phoneNumber,
            birthDate,
            address,
            city,
            district
        } = req.body;

        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ message: 'Kullanıcı bulunamadı' });
        }

        await user.update({
            firstName,
            lastName,
            phoneNumber,
            birthDate,
            address,
            city,
            district
        });

        res.json({
            message: 'Profil başarıyla güncellendi',
            user: {
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                phoneNumber: user.phoneNumber,
                birthDate: user.birthDate,
                address: user.address,
                city: user.city,
                district: user.district,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Profil güncelleme hatası:', error);
        res.status(500).json({ message: 'Sunucu hatası' });
    }
};

module.exports = {
    register,
    login,
    updateProfile
}; 