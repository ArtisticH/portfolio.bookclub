const Sequelize = require('sequelize');

module.exports = class DoneFolder extends Sequelize.Model {
  static init(sequelize) {
    return super.init({
      count: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      MemberId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
    }, {
      sequelize,
      timestamps: true,
      underscored: false,
      modelName: 'DoneFolder',
      tableName: 'doneFolders',
      paranoid: false,
      charset: 'utf8',
      collate: 'utf8_general_ci',
    })
  }

  static associate(db) {
  }
}