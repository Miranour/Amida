const sequelize = require('../config/database');
const User = require('./User');
const Institution = require('./Institution');
const Appointment = require('./Appointment');
const InstitutionService = require('./InstitutionService');
const InstitutionEmployee = require('./InstitutionEmployee');

// User - Institution ilişkisi
User.hasOne(Institution, {
    foreignKey: 'userId',
    as: 'institution'
});

Institution.belongsTo(User, {
    foreignKey: 'userId',
    as: 'user'
});

// User - Appointment ilişkisi
User.hasMany(Appointment, {
    foreignKey: 'userId',
    as: 'appointments'
});

Appointment.belongsTo(User, {
    foreignKey: 'userId',
    as: 'user'
});

// Institution - Appointment ilişkisi
Institution.hasMany(Appointment, {
    foreignKey: 'institutionId',
    as: 'institutionAppointments'
});

Appointment.belongsTo(Institution, {
    foreignKey: 'institutionId',
    as: 'institution'
});

// Institution - InstitutionService ilişkisi
Institution.hasMany(InstitutionService, {
    foreignKey: 'institutionId',
    as: 'services'
});

InstitutionService.belongsTo(Institution, {
    foreignKey: 'institutionId',
    as: 'institution'
});

// Institution - InstitutionEmployee ilişkisi
Institution.hasMany(InstitutionEmployee, {
    foreignKey: 'institutionId',
    as: 'employees'
});

InstitutionEmployee.belongsTo(Institution, {
    foreignKey: 'institutionId',
    as: 'institution'
});

// Appointment - InstitutionService ilişkisi
Appointment.belongsTo(InstitutionService, {
    foreignKey: 'serviceId',
    as: 'service'
});

InstitutionService.hasMany(Appointment, {
    foreignKey: 'serviceId',
    as: 'appointments'
});

// Appointment - InstitutionEmployee ilişkisi
Appointment.belongsTo(InstitutionEmployee, {
    foreignKey: 'employeeId',
    as: 'employee'
});

InstitutionEmployee.hasMany(Appointment, {
    foreignKey: 'employeeId',
    as: 'appointments'
});

module.exports = {
    sequelize,
    User,
    Institution,
    Appointment,
    InstitutionService,
    InstitutionEmployee
}; 