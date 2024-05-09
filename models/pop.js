const Sequelize = require('sequelize');

module.exports = class POP extends Sequelize.Model {
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
      timestamps: false,
      underscored: false,
      modelName: 'POP',
      tableName: 'pop',
      paranoid: false,
      charset: 'utf8mb4',
      collate: 'utf8mb4_general_ci',
    })
  }

  static associate(db) {
  }
}