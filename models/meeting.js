const Sequelize = require('sequelize');

module.exports = class Meeting extends Sequelize.Model {
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
    }, {
      sequelize,
      timestamps: true,
      underscored: false,
      modelName: 'Meeting',
      tableName: 'meetings',
      paranoid: false,
      charset: 'utf8mb4',
      collate: 'utf8mb4_general_ci',
    })
  }

  static associate(db) {
    db.Meeting.belongsTo(db.Member, { foreignKey: 'MemberId', targetKey: 'id'}); // 6. Meeting의 외래키, 작성자
    db.Meeting.belongsToMany(db.Member, { through: 'MeetingLike'}); // 7. Meeting의 좋아요 한번만 클릭 위해 
    db.Meeting.hasMany(db.Comment, { foreignKey: 'MeetingId', sourceKey: 'id'}); // 8. 게시글의 댓글, 
  }
}