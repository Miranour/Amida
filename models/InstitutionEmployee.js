const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const InstitutionEmployee = sequelize.define('InstitutionEmployee', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    institutionId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Institutions',
            key: 'id'
        }
    },
    firstName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    lastName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    title: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: 'Doktor, Berber, Teknisyen vb.'
    },
    specialization: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: 'Uzmanlık alanı'
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
}, {
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

module.exports = InstitutionEmployee; 