const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config')[env];
const { Book, Member, Attend, Review } = require('./main');
const { Folder, List, DoneFolder, DoneList, Sort } = require('./wishlist');
const { Favorite, TS, POP, KPOP, HFC, KFC, HMC, KMC } = require('./favorite');
const Quote = require('./quotes');

const db = {};
// const sequelize = new Sequelize(config.database, config.username, config.password, {
//   port: process.env.DB_PORT,
//   host: process.env.DB_HOST,
//   dialect: 'mysql',
//   logging: false,
// });

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  port: process.env.DB_PORT,
  host: process.env.DB_HOST,
  dialect: 'mysql',
  logging: false,
});

db.sequelize = sequelize;
db.Book = Book;
db.Member = Member;
db.Attend = Attend;
db.Review = Review;
db.Folder = Folder;
db.List = List;
db.DoneFolder = DoneFolder;
db.DoneList = DoneList;
db.Sort = Sort;
db.Favorite = Favorite;
db.TS = TS;
db.HFC = HFC;
db.HMC = HMC;
db.KFC = KFC;
db.KMC = KMC;
db.KPOP = KPOP;
db.POP = POP;
db.Quote = Quote;

Book.init(sequelize);
Member.init(sequelize);
Attend.init(sequelize);
Review.init(sequelize);
Folder.init(sequelize);
List.init(sequelize);
DoneFolder.init(sequelize);
DoneList.init(sequelize);
Sort.init(sequelize);
Favorite.init(sequelize);
TS.init(sequelize);
HFC.init(sequelize);
HMC.init(sequelize);
KFC.init(sequelize);
KMC.init(sequelize);
KPOP.init(sequelize);
POP.init(sequelize);
Quote.init(sequelize);

Book.associate(db);
Member.associate(db);
Review.associate(db);
Folder.associate(db);
List.associate(db);
DoneList.associate(db);
Quote.associate(db);

module.exports = db;
