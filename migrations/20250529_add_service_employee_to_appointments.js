'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Appointments', 'serviceId', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'InstitutionServices',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });

    await queryInterface.addColumn('Appointments', 'employeeId', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'InstitutionEmployees',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Appointments', 'serviceId');
    await queryInterface.removeColumn('Appointments', 'employeeId');
  }
}; 