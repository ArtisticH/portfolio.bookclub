const Sequelize = require('sequelize');

module.exports = class Member extends Sequelize.Model {
  static init(sequelize) {
    return super.init({

    }, {
      sequelize,
      timestamps: true,
      underscored: false,
      modelName: 'Member',
      tableName: 'members',
      paranoid: true,
      charset: 'utf8',
      collate: 'utf8_general_ci',
    })
  }

  static associate(db) {
    // db.Member.hasMany(db.Book, { foreignKey: 'recommender', sourceKey: 'id'});
  }
}