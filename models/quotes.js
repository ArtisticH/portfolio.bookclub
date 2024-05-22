const Sequelize = require('sequelize');

module.exports = class Quote extends Sequelize.Model {
  static init(sequelize) {
    return super.init({
      img: {
        type: Sequelize.STRING(500),
        allowNull: false,
      },
    }, {
      sequelize,
      timestamps: true,
      underscored: false,
      modelName: 'Quote',
      tableName: 'quotes',
      paranoid: false,
      charset: 'utf8',
      collate: 'utf8_general_ci',
    })
  }

  static associate(db) {
    db.Quote.belongsTo(db.Member, { foreignKey: 'MemberId', targetKey: 'id'}); 
  }
}