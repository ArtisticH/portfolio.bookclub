const Sequelize = require('sequelize');

class Favorite extends Sequelize.Model {
  static init(sequelize) {
    return super.init({
      title: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      // basic은 그냥 제목만
      // music은 제목, 음악, 가수가 한 사람일때
      // music2는 제목, 음악, 가수가 다 다를때
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
}

class RecordFavortie extends Sequelize.Model {
  static init(sequelize) {
    return super.init({
      MemberId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      FavoriteId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      main: {
        type: Sequelize.STRING(500),
        allowNull: false,
      },
      sub: {
        type: Sequelize.STRING(500),
        allowNull: false,
      },
    }, {
      sequelize,
      timestamps: false,
      underscored: false,
      modelName: 'RecordFavortie',
      tableName: 'recordFavortie',
      paranoid: false,
      charset: 'utf8',
      collate: 'utf8_general_ci',
    })
  }
}

class TS extends Sequelize.Model {
  static init(sequelize) {
    return super.init({
      main: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      sub: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      selected: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      win: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      finalWin: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
    }, {
      sequelize,
      timestamps: false,
      underscored: false,
      modelName: 'TS',
      tableName: 'ts',
      paranoid: false,
      charset: 'utf8mb4',
      collate: 'utf8mb4_general_ci',
    })
  }
}

class POP extends Sequelize.Model {
  static init(sequelize) {
    return super.init({
      main: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      sub: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      selected: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      win: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      finalWin: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
    }, {
      sequelize,
      timestamps: false,
      underscored: false,
      modelName: 'POP',
      tableName: 'pop',
      paranoid: false,
      charset: 'utf8mb4',
      collate: 'utf8mb4_general_ci',
    })
  }
}

class KPOP extends Sequelize.Model {
  static init(sequelize) {
    return super.init({
      main: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      sub: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      selected: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      win: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      finalWin: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
    }, {
      sequelize,
      timestamps: false,
      underscored: false,
      modelName: 'KPOP',
      tableName: 'kpop',
      paranoid: false,
      charset: 'utf8mb4',
      collate: 'utf8mb4_general_ci',
    })
  }
}

class HFC extends Sequelize.Model {
  static init(sequelize) {
    return super.init({
      main: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      sub: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      selected: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      win: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      finalWin: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
    }, {
      sequelize,
      timestamps: false,
      underscored: false,
      modelName: 'HFC',
      tableName: 'hfc',
      paranoid: false,
      charset: 'utf8mb4',
      collate: 'utf8mb4_general_ci',
    })
  }
}

class KFC extends Sequelize.Model {
  static init(sequelize) {
    return super.init({
      main: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      sub: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      selected: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      win: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      finalWin: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
    }, {
      sequelize,
      timestamps: false,
      underscored: false,
      modelName: 'KFC',
      tableName: 'kfc',
      paranoid: false,
      charset: 'utf8mb4',
      collate: 'utf8mb4_general_ci',
    })
  }
}

class HMC extends Sequelize.Model {
  static init(sequelize) {
    return super.init({
      main: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      sub: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      selected: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      win: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      finalWin: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
    }, {
      sequelize,
      timestamps: false,
      underscored: false,
      modelName: 'HMC',
      tableName: 'hmc',
      paranoid: false,
      charset: 'utf8mb4',
      collate: 'utf8mb4_general_ci',
    })
  }
}

class KMC extends Sequelize.Model {
  static init(sequelize) {
    return super.init({
      main: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      sub: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      selected: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      win: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      finalWin: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
    }, {
      sequelize,
      timestamps: false,
      underscored: false,
      modelName: 'KMC',
      tableName: 'kmc',
      paranoid: false,
      charset: 'utf8mb4',
      collate: 'utf8mb4_general_ci',
    })
  }
}

module.exports = {
  Favorite,
  RecordFavortie,
  TS,
  POP,
  KPOP,
  HFC,
  KFC,
  HMC,
  KMC,
}
