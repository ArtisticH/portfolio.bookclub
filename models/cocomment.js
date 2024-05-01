const Sequelize = require('sequelize');

module.exports = class Cocomment extends Sequelize.Model {
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
      modelName: 'Cocomment',
      tableName: 'cocomments',
      paranoid: false,
      charset: 'utf8mb4',
      collate: 'utf8mb4_general_ci',
    })
  }

  static associate(db) {
    db.Cocomment.belongsTo(db.Comment, { foreignKey: 'CommentId', targetKey: 'id'}); // 9. 게시글 댓글의 대댓글 
  }
}