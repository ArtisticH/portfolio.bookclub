const Sequelize = require('sequelize');

class Book extends Sequelize.Model {
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

class Member extends Sequelize.Model {
  static init(sequelize) {
    return super.init({
      type: {
        type: Sequelize.STRING(10),
        allowNull: false,
        defaultValue: 'GUEST',
      },
      email: {
        type: Sequelize.STRING(100),
        allowNull: true,
        unique: true
      },
      nick: {
        type: Sequelize.STRING(20),
        allowNull: false,
      },
      password: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      provider: {
        type: Sequelize.STRING(20),
        allowNull: false,
        defaultValue: 'local',
      },
      snsId: {
        type: Sequelize.STRING(30),
        allowNull: true,
      },
    }, {
      sequelize,
      timestamps: false,
      underscored: false,
      modelName: 'Member',
      tableName: 'members',
      paranoid: false,
      charset: 'utf8mb4',
      collate: 'utf8mb4_general_ci',
    })
  }

  static associate(db) {
    db.Member.hasMany(db.Review, { foreignKey: 'MemberId', sourceKey: 'id'}); 
    db.Member.belongsToMany(db.Review, { through: 'ReviewLike'}); 
    db.Member.hasMany(db.Folder, { foreignKey: 'MemberId', sourceKey: 'id'}); 
    db.Member.hasMany(db.List, { foreignKey: 'MemberId', sourceKey: 'id'}); 
    db.Member.hasMany(db.Quote, { foreignKey: 'MemberId', sourceKey: 'id'}); 
  }
}

class Attend extends Sequelize.Model {
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
}

class Review extends Sequelize.Model {
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

module.exports = {
  Book,
  Member,
  Attend,
  Review,
}
