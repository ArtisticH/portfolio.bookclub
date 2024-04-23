const Sequelize = require('sequelize');

module.exports = class Meeting extends Sequelize.Model {
  static init(sequelize) {
    return super.init({

    }, {
      sequelize,
      timestamps: true,
      underscored: false,
      modelName: 'Meeting',
      tableName: 'meetings',
      paranoid: true,
      charset: 'utf8',
      collate: 'utf8_general_ci',
    })
  }

  static associate(db) {
    
  }
}