const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Institution = sequelize.define('Institution', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Users',
            key: 'id'
        }
    },
    institutionName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    taxNumber: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    institutionPhone: {
        type: DataTypes.STRING,
        allowNull: false
    },
    institutionEmail: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isEmail: true
        }
    },
    institutionAddress: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    city: {
        type: DataTypes.STRING,
        allowNull: false
    },
    district: {
        type: DataTypes.STRING,
        allowNull: false
    },
    institutionType: {
        type: DataTypes.ENUM('Diş Kliniği', 'Berber', 'Halı Saha', 'Restorant', 'Diğerleri'),
        allowNull: false
    },
    workingHours: {
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue: {}
    },
    logo: {
        type: DataTypes.STRING,
        allowNull: true
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    website: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
            isUrl: true
        }
    },
    socialMedia: {
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue: {}
    },
    appointmentDuration: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 30,
        validate: {
            min: 5,
            max: 240
        }
    },
    maxAppointmentsPerDay: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 20,
        validate: {
            min: 1,
            max: 100
        }
    },
    breakTime: {
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue: {
            start: '12:00',
            end: '13:00'
        }
    },
    holidays: {
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue: []
    },
    notificationSettings: {
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue: {
            email: true,
            sms: false,
            push: true
        }
    },
    emailNotifications: {
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue: {
            newAppointment: true,
            appointmentReminder: true,
            appointmentCancellation: true,
            appointmentConfirmation: true
        }
    },
    smsNotifications: {
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue: {
            newAppointment: false,
            appointmentReminder: false,
            appointmentCancellation: false,
            appointmentConfirmation: false
        }
    },
    isVerified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
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

module.exports = Institution; 