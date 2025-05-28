const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Appointment = sequelize.define('Appointment', {
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
    userId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'Users',
            key: 'id'
        }
    },
    date: {
        type: DataTypes.DATE,
        allowNull: false
    },
    timeSlot: {
        type: DataTypes.STRING,
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('available', 'booked', 'cancelled'),
        defaultValue: 'available'
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    maxParticipants: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1
    },
    currentParticipants: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    }
}, {
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

module.exports = Appointment; 