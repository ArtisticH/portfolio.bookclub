const Sequelize = require('sequelize');

module.exports = class Member extends Sequelize.Model {
  static init(sequelize) {
    return super.init({
      type: {
        type: Sequelize.STRING(10),
        allowNull: false,
        defaultValue: 'guest',
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
      charset: 'utf8',
      collate: 'utf8_general_ci',
    })
  }

  static associate(db) {
    db.Member.hasMany(db.Review, { foreignKey: 'MemberId', sourceKey: 'id'}); // 3. Review의 외래키, 작성자
    db.Member.belongsToMany(db.Review, { through: 'ReviewLike'}); // 4. Review의 좋아요 한번만 클릭 위해 
    db.Member.hasMany(db.Meeting, { foreignKey: 'MemberId', sourceKey: 'id'}); // 6. Meeting의 외래키, 작성자
    db.Member.belongsToMany(db.Meeting, { through: 'MeetingLike'}); // 7. Meeting의 좋아요 한번만 클릭 위해 
    db.Member.hasMany(db.Folder, { foreignKey: 'MemberId', sourceKey: 'id'}); // 폴더의 외래키
    db.Member.hasMany(db.List, { foreignKey: 'MemberId', sourceKey: 'id'}); // 리스트의 외래키
    db.Member.hasMany(db.DoneList, { foreignKey: 'MemberId', sourceKey: 'id'}); 
  }
}