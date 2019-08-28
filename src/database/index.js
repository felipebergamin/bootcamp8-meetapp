import Sequelize from 'sequelize';

import dbConfig from '../config/database';

const models = [];

class Database {
  constructor() {
    this.init();
  }

  init() {
    this.sequelize();
  }

  sequelize() {
    this.sequelizeConnection = new Sequelize(dbConfig);
    models
      .map(model => model.init(this.sequelizeConnection))
      .map(
        model =>
          model.associate && model.associate(this.sequelizeConnection.models)
      );
  }
}

export default new Database();
