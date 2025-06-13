const express = require('express');
const router = express.Router();
const { auth, checkRole } = require('../middleware/auth');
const {
    getInstitutionServices,
    createService,
    updateService,
    deleteService,
    getServicesByInstitutionId
} = require('../controllers/serviceController');

// Kurum için hizmet yönetimi
router.get('/', auth, checkRole(['institution']), getInstitutionServices);
router.post('/', auth, checkRole(['institution']), createService);
router.put('/:serviceId', auth, checkRole(['institution']), updateService);
router.delete('/:serviceId', auth, checkRole(['institution']), deleteService);

// Müşteriler için kurum hizmetlerini görme
router.get('/institution/:institutionId', getServicesByInstitutionId);

module.exports = router; 