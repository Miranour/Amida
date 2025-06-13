const { InstitutionService, Institution } = require('../models');
const { auth, checkRole } = require('../middleware/auth');

// Kuruma ait hizmetleri listele
const getInstitutionServices = async (req, res) => {
    try {
        const userId = req.user.id;
        const institution = await Institution.findOne({ where: { userId } });
        if (!institution) {
            return res.status(404).json({ message: 'Kurum bulunamadı' });
        }

        const services = await InstitutionService.findAll({
            where: { institutionId: institution.id },
            order: [['serviceName', 'ASC']]
        });

        res.json(services);
    } catch (error) {
        console.error('Hizmetler getirme hatası:', error);
        res.status(500).json({ message: 'Sunucu hatası' });
    }
};

// Hizmet ekleme
const createService = async (req, res) => {
    try {
        const userId = req.user.id;
        const institution = await Institution.findOne({ where: { userId } });
        if (!institution) {
            return res.status(404).json({ message: 'Kurum bulunamadı' });
        }

        const { serviceName, description, duration, price } = req.body;

        const service = await InstitutionService.create({
            institutionId: institution.id,
            serviceName,
            description,
            duration,
            price,
            isActive: true
        });

        res.status(201).json({
            message: 'Hizmet başarıyla eklendi',
            service
        });
    } catch (error) {
        console.error('Hizmet ekleme hatası:', error);
        res.status(500).json({ message: 'Sunucu hatası' });
    }
};

// Hizmet güncelleme
const updateService = async (req, res) => {
    try {
        const { serviceId } = req.params;
        const userId = req.user.id;
        const institution = await Institution.findOne({ where: { userId } });
        if (!institution) {
            return res.status(404).json({ message: 'Kurum bulunamadı' });
        }

        const service = await InstitutionService.findOne({
            where: { 
                id: serviceId, 
                institutionId: institution.id 
            }
        });

        if (!service) {
            return res.status(404).json({ message: 'Hizmet bulunamadı' });
        }

        const { serviceName, description, duration, price } = req.body;

        await service.update({
            serviceName,
            description,
            duration,
            price
        });

        res.json({
            message: 'Hizmet başarıyla güncellendi',
            service
        });
    } catch (error) {
        console.error('Hizmet güncelleme hatası:', error);
        res.status(500).json({ message: 'Sunucu hatası' });
    }
};

// Hizmet silme (soft delete)
const deleteService = async (req, res) => {
    try {
        const { serviceId } = req.params;
        const userId = req.user.id;
        const institution = await Institution.findOne({ where: { userId } });
        if (!institution) {
            return res.status(404).json({ message: 'Kurum bulunamadı' });
        }

        const service = await InstitutionService.findOne({
            where: { 
                id: serviceId, 
                institutionId: institution.id 
            }
        });

        if (!service) {
            return res.status(404).json({ message: 'Hizmet bulunamadı' });
        }

        await service.update({ isActive: false });

        res.json({
            message: 'Hizmet başarıyla silindi'
        });
    } catch (error) {
        console.error('Hizmet silme hatası:', error);
        res.status(500).json({ message: 'Sunucu hatası' });
    }
};

// Belirli kurum ID'sine göre hizmetleri listele (müşteriler için)
const getServicesByInstitutionId = async (req, res) => {
    try {
        const { institutionId } = req.params;

        const services = await InstitutionService.findAll({
            where: { 
                institutionId,
                isActive: true 
            },
            order: [['serviceName', 'ASC']]
        });

        res.json(services);
    } catch (error) {
        console.error('Kurum hizmetleri getirme hatası:', error);
        res.status(500).json({ message: 'Sunucu hatası' });
    }
};

module.exports = {
    getInstitutionServices,
    createService,
    updateService,
    deleteService,
    getServicesByInstitutionId
}; 