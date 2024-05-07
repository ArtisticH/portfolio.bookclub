const Sequelize = require('sequelize');

module.exports = class Review extends Sequelize.Model {
  static init(sequelize) {
    return super.init({
      title: {
        type: Sequelize.STRING(300),
        allowNull: false,
      },
      text: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      like: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        defaultValue: 0,
      },
      overText: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
      },
      stars: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
      },
    }, {
      sequelize,
      timestamps: true,
      underscored: false,
      modelName: 'Review',
      tableName: 'reviews',
      paranoid: false,
      charset: 'utf8mb4',
      collate: 'utf8mb4_general_ci',
    })
  }

  static associate(db) {
    db.Review.belongsTo(db.Member, { foreignKey: 'MemberId', targetKey: 'id'}); 
    db.Review.belongsTo(db.Book, { foreignKey: 'BookId', targetKey: 'id'}); 
    db.Review.belongsToMany(db.Member, { through: 'ReviewLike'}); 
  }
}