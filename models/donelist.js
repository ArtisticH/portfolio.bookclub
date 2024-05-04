const Sequelize = require('sequelize');

module.exports = class DoneList extends Sequelize.Model {
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
    }, {
      sequelize,
      timestamps: true,
      underscored: false,
      modelName: 'DoneList',
      tableName: 'doneLists',
      paranoid: false,
      charset: 'utf8mb4',
      collate: 'utf8mb4_general_ci',
    })
  }

  static associate(db) {
    db.DoneList.belongsTo(db.Folder, { foreignKey: 'FolderId', targetKey: 'id'}); // 외래키
    db.DoneList.belongsTo(db.Member, { foreignKey: 'MemberId', targetKey: 'id'}); // 외래키
  }
}