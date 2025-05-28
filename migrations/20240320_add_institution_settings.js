'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Institutions', 'logo', {
      type: Sequelize.STRING,
      allowNull: true
    });

    await queryInterface.addColumn('Institutions', 'description', {
      type: Sequelize.TEXT,
      allowNull: true
    });

    await queryInterface.addColumn('Institutions', 'website', {
      type: Sequelize.STRING,
      allowNull: true
    });

    await queryInterface.addColumn('Institutions', 'socialMedia', {
      type: Sequelize.JSON,
      allowNull: true,
      defaultValue: {}
    });

    await queryInterface.addColumn('Institutions', 'appointmentDuration', {
      type: Sequelize.INTEGER,
      allowNull: true,
      defaultValue: 30
    });

    await queryInterface.addColumn('Institutions', 'maxAppointmentsPerDay', {
      type: Sequelize.INTEGER,
      allowNull: true,
      defaultValue: 20
    });

    await queryInterface.addColumn('Institutions', 'breakTime', {
      type: Sequelize.JSON,
      allowNull: true,
      defaultValue: {
        start: '12:00',
        end: '13:00'
      }
    });

    await queryInterface.addColumn('Institutions', 'holidays', {
      type: Sequelize.JSON,
      allowNull: true,
      defaultValue: []
    });

    await queryInterface.addColumn('Institutions', 'notificationSettings', {
      type: Sequelize.JSON,
      allowNull: true,
      defaultValue: {
        email: true,
        sms: false,
        push: true
      }
    });

    await queryInterface.addColumn('Institutions', 'emailNotifications', {
      type: Sequelize.JSON,
      allowNull: true,
      defaultValue: {
        newAppointment: true,
        appointmentReminder: true,
        appointmentCancellation: true,
        appointmentConfirmation: true
      }
    });

    await queryInterface.addColumn('Institutions', 'smsNotifications', {
      type: Sequelize.JSON,
      allowNull: true,
      defaultValue: {
        newAppointment: false,
        appointmentReminder: false,
        appointmentCancellation: false,
        appointmentConfirmation: false
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Institutions', 'logo');
    await queryInterface.removeColumn('Institutions', 'description');
    await queryInterface.removeColumn('Institutions', 'website');
    await queryInterface.removeColumn('Institutions', 'socialMedia');
    await queryInterface.removeColumn('Institutions', 'appointmentDuration');
    await queryInterface.removeColumn('Institutions', 'maxAppointmentsPerDay');
    await queryInterface.removeColumn('Institutions', 'breakTime');
    await queryInterface.removeColumn('Institutions', 'holidays');
    await queryInterface.removeColumn('Institutions', 'notificationSettings');
    await queryInterface.removeColumn('Institutions', 'emailNotifications');
    await queryInterface.removeColumn('Institutions', 'smsNotifications');
  }
}; 