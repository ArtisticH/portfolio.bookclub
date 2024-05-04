const Sequelize = require('sequelize');

module.exports = class RecordChoice extends Sequelize.Model {
  static init(sequelize) {
    return super.init({
      main: {
        type: Sequelize.STRING(500),
        allowNull: false,
      },
      sub: {
        type: Sequelize.STRING(500),
        allowNull: false,
      },
    }, {
      sequelize,
      timestamps: true,
      underscored: false,
      modelName: 'RecordChoice',
      tableName: 'recordChoice',
      paranoid: false,
      charset: 'utf8',
      collate: 'utf8_general_ci',
    })
  }

  static associate(db) {
  }
}