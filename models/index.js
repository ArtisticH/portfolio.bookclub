const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];
const Book = require('./book');
const Member = require('./member');
const Attend = require('./attend');
const Review = require('./review');
const Meeting = require('./meeting');
const Comment = require('./comment');
const Cocomment = require('./cocomment');

const db = {};
const sequelize = new Sequelize(config.database, config.username, config.password, config);

db.sequelize = sequelize;
db.Book = Book;
db.Member = Member;
db.Attend = Attend;
db.Review = Review;
db.Meeting = Meeting;
db.Comment = Comment;
db.Cocomment = Cocomment;

Book.init(sequelize);
Member.init(sequelize);
Attend.init(sequelize);
Review.init(sequelize);
Meeting.init(sequelize);
Comment.init(sequelize);
Cocomment.init(sequelize);

Book.associate(db);
Member.associate(db);
Review.associate(db);
Meeting.associate(db);
Comment.associate(db);
Cocomment.associate(db);

module.exports = db;
