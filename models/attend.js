const Sequelize = require('sequelize');

module.exports = class Attend extends Sequelize.Model {
  static init(sequelize) {
    return super.init({
      BookId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      MemberId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
    }, {
      sequelize,
      timestamps: false,
      underscored: false,
      modelName: 'Attend',
      tableName: 'attend',
      paranoid: false,
      charset: 'utf8',
      collate: 'utf8_general_ci',
    })
  }

  static associate(db) {
  }
}