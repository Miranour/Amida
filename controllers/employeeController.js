const { InstitutionEmployee, Institution } = require('../models');
const { auth, checkRole } = require('../middleware/auth');

// Kuruma ait çalışanları listele
const getInstitutionEmployees = async (req, res) => {
    try {
        const userId = req.user.id;
        const institution = await Institution.findOne({ where: { userId } });
        if (!institution) {
            return res.status(404).json({ message: 'Kurum bulunamadı' });
        }

        const employees = await InstitutionEmployee.findAll({
            where: { 
                institutionId: institution.id,
                isActive: true 
            },
            order: [['firstName', 'ASC']]
        });

        res.json(employees);
    } catch (error) {
        console.error('Çalışanlar getirme hatası:', error);
        res.status(500).json({ message: 'Sunucu hatası' });
    }
};

// Çalışan ekleme
const createEmployee = async (req, res) => {
    try {
        const userId = req.user.id;
        const institution = await Institution.findOne({ where: { userId } });
        if (!institution) {
            return res.status(404).json({ message: 'Kurum bulunamadı' });
        }

        const { firstName, lastName, title, specialization } = req.body;

        const employee = await InstitutionEmployee.create({
            institutionId: institution.id,
            firstName,
            lastName,
            title,
            specialization,
            isActive: true
        });

        res.status(201).json({
            message: 'Çalışan başarıyla eklendi',
            employee
        });
    } catch (error) {
        console.error('Çalışan ekleme hatası:', error);
        res.status(500).json({ message: 'Sunucu hatası' });
    }
};

// Çalışan güncelleme
const updateEmployee = async (req, res) => {
    try {
        const { employeeId } = req.params;
        const userId = req.user.id;
        const institution = await Institution.findOne({ where: { userId } });
        if (!institution) {
            return res.status(404).json({ message: 'Kurum bulunamadı' });
        }

        const employee = await InstitutionEmployee.findOne({
            where: { 
                id: employeeId, 
                institutionId: institution.id 
            }
        });

        if (!employee) {
            return res.status(404).json({ message: 'Çalışan bulunamadı' });
        }

        const { firstName, lastName, title, specialization } = req.body;

        await employee.update({
            firstName,
            lastName,
            title,
            specialization
        });

        res.json({
            message: 'Çalışan başarıyla güncellendi',
            employee
        });
    } catch (error) {
        console.error('Çalışan güncelleme hatası:', error);
        res.status(500).json({ message: 'Sunucu hatası' });
    }
};

// Çalışan silme (soft delete)
const deleteEmployee = async (req, res) => {
    try {
        const { employeeId } = req.params;
        const userId = req.user.id;
        const institution = await Institution.findOne({ where: { userId } });
        if (!institution) {
            return res.status(404).json({ message: 'Kurum bulunamadı' });
        }

        const employee = await InstitutionEmployee.findOne({
            where: { 
                id: employeeId, 
                institutionId: institution.id 
            }
        });

        if (!employee) {
            return res.status(404).json({ message: 'Çalışan bulunamadı' });
        }

        await employee.update({ isActive: false });

        res.json({
            message: 'Çalışan başarıyla silindi'
        });
    } catch (error) {
        console.error('Çalışan silme hatası:', error);
        res.status(500).json({ message: 'Sunucu hatası' });
    }
};

// Belirli kurum ID'sine göre çalışanları listele (müşteriler için)
const getEmployeesByInstitutionId = async (req, res) => {
    try {
        const { institutionId } = req.params;

        const employees = await InstitutionEmployee.findAll({
            where: { 
                institutionId,
                isActive: true 
            },
            order: [['firstName', 'ASC']]
        });

        res.json(employees);
    } catch (error) {
        console.error('Kurum çalışanları getirme hatası:', error);
        res.status(500).json({ message: 'Sunucu hatası' });
    }
};

module.exports = {
    getInstitutionEmployees,
    createEmployee,
    updateEmployee,
    deleteEmployee,
    getEmployeesByInstitutionId
}; 