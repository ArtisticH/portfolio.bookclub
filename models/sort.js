const Sequelize = require('sequelize');

module.exports = class Sort extends Sequelize.Model {
  static init(sequelize) {
    return super.init({
      MemberId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      sort: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      order: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
    }, {
      sequelize,
      timestamps: false,
      underscored: false,
      modelName: 'Sort',
      tableName: 'sorts',
      paranoid: false,
      charset: 'utf8',
      collate: 'utf8_general_ci',
    })
  }

  static associate(db) {
  }
}