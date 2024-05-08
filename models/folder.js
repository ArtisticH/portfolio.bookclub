const Sequelize = require('sequelize');

module.exports = class Folder extends Sequelize.Model {
  static init(sequelize) {
    return super.init({
      title: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      count: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      public: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
      },
    }, {
      sequelize,
      timestamps: true,
      underscored: false,
      modelName: 'Folder',
      tableName: 'folders',
      paranoid: false,
      charset: 'utf8mb4',
      collate: 'utf8mb4_general_ci',
    })
  }

  static associate(db) {
    db.Folder.belongsTo(db.Member, { foreignKey: 'MemberId', targetKey: 'id'}); 
    db.Folder.hasMany(db.List, { foreignKey: 'FolderId', sourceKey: 'id'}); 
  }
}