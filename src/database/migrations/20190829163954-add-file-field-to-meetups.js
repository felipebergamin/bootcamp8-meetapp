module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('meetups', 'file_id', {
      allowNull: true,
      type: Sequelize.INTEGER,
      references: {
        model: 'files',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    });
  },

  down: queryInterface => {
    return queryInterface.removeColumn('meetups', 'file_id');
  },
};
