const Sequelize = require('sequelize');

module.exports = class RecordFavortie extends Sequelize.Model {
  static init(sequelize) {
    return super.init({
      MemberId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      FavoriteId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
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
      timestamps: false,
      underscored: false,
      modelName: 'RecordFavortie',
      tableName: 'recordFavortie',
      paranoid: false,
      charset: 'utf8',
      collate: 'utf8_general_ci',
    })
  }

  static associate(db) {
  }
}