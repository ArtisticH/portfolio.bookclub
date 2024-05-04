const Sequelize = require('sequelize');

module.exports = class KFC extends Sequelize.Model {
  static init(sequelize) {
    return super.init({
      main: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      sub: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      selected: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      win: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      finalWin: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
    }, {
      sequelize,
      timestamps: true,
      underscored: false,
      modelName: 'KFC',
      tableName: 'kfc',
      paranoid: false,
      charset: 'utf8mb4',
      collate: 'utf8mb4_general_ci',
    })
  }

  static associate(db) {
  }
}