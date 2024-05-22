const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];
const { Book, Member, Attend, Review } = require('./main');
const { Folder, List, DoneFolder, Sort } = require('./wishlist');
const { Favorite, RecordFavortie, TS, POP, KPOP, HFC, KFC, HMC, KMC } = require('./favorite');
const Quote = require('./quotes');

const db = {};
const sequelize = new Sequelize(config.database, config.username, config.password, config);

db.sequelize = sequelize;
db.Book = Book;
db.Member = Member;
db.Attend = Attend;
db.Review = Review;
db.Folder = Folder;
db.List = List;
db.DoneFolder = DoneFolder;
db.Sort = Sort;
db.Favorite = Favorite;
db.RecordFavortie = RecordFavortie;
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
Sort.init(sequelize);
Favorite.init(sequelize);
RecordFavortie.init(sequelize);
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
Quote.associate(db);

module.exports = db;
