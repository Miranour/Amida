const express = require('express');
const router = express.Router();
const { auth, checkRole } = require('../middleware/auth');
const {
    getInstitutionEmployees,
    createEmployee,
    updateEmployee,
    deleteEmployee,
    getEmployeesByInstitutionId
} = require('../controllers/employeeController');

// Kurum için çalışan yönetimi
router.get('/', auth, checkRole(['institution']), getInstitutionEmployees);
router.post('/', auth, checkRole(['institution']), createEmployee);
router.put('/:employeeId', auth, checkRole(['institution']), updateEmployee);
router.delete('/:employeeId', auth, checkRole(['institution']), deleteEmployee);

// Müşteriler için kurum çalışanlarını görme
router.get('/institution/:institutionId', getEmployeesByInstitutionId);

module.exports = router; 