const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];
const Book = require('./book');
const Member = require('./member');
const Meeting = require('./meeting');

const db = {};
const sequelize = new Sequelize(config.database, config.username, config.password, config);

db.sequelize = sequelize;
db.Book = Book;
// db.Member = Member;
// db.Meeting = Meeting;

Book.init(sequelize);
// Member.init(sequelize);
// Meeting.init(sequelize);

Book.associate(db);
// Member.associate(db);
// Meeting.associate(db);

module.exports = db;
