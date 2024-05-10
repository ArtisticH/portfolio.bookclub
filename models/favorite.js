const Sequelize = require('sequelize');

module.exports = class Favorite extends Sequelize.Model {
  static init(sequelize) {
    return super.init({
      title: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      // basic은 그냥 제목?만
      // music은 제목, play와 pause버튼, 가수가 한 사람일때
      // music2는 제목, 가수, play + pause, 가수가 다 다를때
      types: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      // 대표 썸네일 사진
      img: {
        type: Sequelize.STRING(500),
        allowNull: false,
      },
      explanation: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      modelName: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      round: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
    }, {
      sequelize,
      timestamps: false,
      underscored: false,
      modelName: 'Favorite',
      tableName: 'favorite',
      paranoid: false,
      charset: 'utf8',
      collate: 'utf8_general_ci',
    })
  }

  static associate(db) {
  }
}