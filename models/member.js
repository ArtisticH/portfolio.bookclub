const Sequelize = require('sequelize');

module.exports = class Member extends Sequelize.Model {
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