const Sequelize = require('sequelize');

class Folder extends Sequelize.Model {
  static init(sequelize) {
    return super.init({
      title: {
        type: Sequelize.STRING(15),
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
    db.Folder.hasMany(db.DoneList, { foreignKey: 'FolderId', sourceKey: 'id'}); 
  }
}

class List extends Sequelize.Model {
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

class DoneFolder extends Sequelize.Model {
  static init(sequelize) {
    return super.init({
      count: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      public: {
        type: Sequelize.BOOLEAN,
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
      modelName: 'DoneFolder',
      tableName: 'doneFolders',
      paranoid: false,
      charset: 'utf8',
      collate: 'utf8_general_ci',
    })
  }
}

class DoneList extends Sequelize.Model {
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
    }, {
      sequelize,
      timestamps: true,
      underscored: false,
      modelName: 'DoneList',
      tableName: 'doneList',
      paranoid: false,
      charset: 'utf8mb4',
      collate: 'utf8mb4_general_ci',
    })
  }

  static associate(db) {
    db.DoneList.belongsTo(db.Folder, { foreignKey: 'FolderId', targetKey: 'id'});
    db.DoneList.belongsTo(db.Member, { foreignKey: 'MemberId', targetKey: 'id'});
  }
}

class Sort extends Sequelize.Model {
  static init(sequelize) {
    return super.init({
      MemberId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      sort: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      order: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
    }, {
      sequelize,
      timestamps: false,
      underscored: false,
      modelName: 'Sort',
      tableName: 'sorts',
      paranoid: false,
      charset: 'utf8',
      collate: 'utf8_general_ci',
    })
  }
}

module.exports = {
  Folder,
  List,
  DoneFolder,
  DoneList,
  Sort,
}
