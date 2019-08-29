module.exports = {
  up: queryInterface => {
    return queryInterface.renameColumn('meetups', 'dateTime', 'date_time');
  },

  down: queryInterface => {
    return queryInterface.renameColumn('meetups', 'date_time', 'dateTime');
  },
};
