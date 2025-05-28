const User = require('./User');
const Institution = require('./Institution');
const Appointment = require('./Appointment');
const sequelize = require('../config/database');

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

module.exports = {
    User,
    Institution,
    Appointment,
    sequelize
}; 