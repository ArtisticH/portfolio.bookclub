const Sequelize = require('sequelize');

module.exports = class Choice extends Sequelize.Model {
  static init(sequelize) {
    return super.init({
      title: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      types: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      img: {
        type: Sequelize.STRING(500),
        allowNull: false,
      },
      explanation: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      tableName: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      round: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
    }, {
      sequelize,
      timestamps: true,
      underscored: false,
      modelName: 'Choice',
      tableName: 'choices',
      paranoid: false,
      charset: 'utf8',
      collate: 'utf8_general_ci',
    })
  }

  static associate(db) {
    db.Favorite.belongsToMany(db.Member, { through: 'RecordFavorite'}); 
  }
}