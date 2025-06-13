const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const InstitutionService = sequelize.define('InstitutionService', {
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
    serviceName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    duration: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 30,
        comment: 'Hizmet süresi (dakika)'
    },
    price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true
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

module.exports = InstitutionService; 