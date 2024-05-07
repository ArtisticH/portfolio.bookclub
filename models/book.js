const Sequelize = require('sequelize');

module.exports = class Book extends Sequelize.Model {
  static init(sequelize) {
    return super.init({
      title: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      author: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      img: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      meetingDate: {
        type: Sequelize.STRING(100),
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
      modelName: 'Book',
      tableName: 'books',
      paranoid: false,
      charset: 'utf8',
      collate: 'utf8_general_ci',
    })
  }

  static associate(db) {
    db.Book.hasMany(db.Review, { foreignKey: 'BookId', sourceKey: 'id'}); 
  }
}