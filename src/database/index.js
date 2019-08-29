import Sequelize from 'sequelize';

import dbConfig from '../config/database';
import User from '../app/models/User';
import File from '../app/models/File';
import Meetup from '../app/models/Meetup';
import Subscription from '../app/models/Subscription';

const models = [User, File, Meetup, Subscription];

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
