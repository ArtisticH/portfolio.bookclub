const Sequelize = require('sequelize');

module.exports = class Comment extends Sequelize.Model {
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
    }, {
      sequelize,
      timestamps: true,
      underscored: false,
      modelName: 'Comment',
      tableName: 'comments',
      paranoid: true,
      charset: 'utf8mb4',
      collate: 'utf8mb4_general_ci',
    })
  }

  static associate(db) {
    db.Comment.belongsTo(db.Meeting, { foreignKey: 'MeetingId', targetKey: 'id'}); // 8. 게시글의 댓글, 
    db.Comment.hasMany(db.Cocomment, { foreignKey: 'CommentId', sourceKey: 'id'}); // 9. 게시글 댓글의 대댓글 
  }
}