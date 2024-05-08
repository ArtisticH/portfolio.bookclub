const Sequelize = require('sequelize');

module.exports = class List extends Sequelize.Model {
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
        type: Sequelize.STRING(500),
        allowNull: false,
        defaultValue: '',
      },
      done: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      }
    }, {
      sequelize,
      timestamps: true,
      underscored: false,
      modelName: 'List',
      tableName: 'lists',
      paranoid: false,
      charset: 'utf8mb4',
      collate: 'utf8mb4_general_ci',
    })
  }

  static associate(db) {
    db.List.belongsTo(db.Folder, { foreignKey: 'FolderId', targetKey: 'id'});
    db.List.belongsTo(db.Member, { foreignKey: 'MemberId', targetKey: 'id'});
  }
}