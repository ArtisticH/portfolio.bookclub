const express = require('express');
const cooikeParser = require('cookie-parser');
const morgan = require('morgan');
const path = require('path');
const session = require('express-session');
const nunjucks = require('nunjucks');
const dotenv = require('dotenv');
const passport = require('passport');
const { createClient } = require('redis');
const RedisStore = require('connect-redis').default;
const mysql = require('mysql');

const db = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root',
  password: 'hannamysql',
  database: 'bookclub',
  port: '3306',
});

db.connect();
dotenv.config();
const redisClient = createClient({
  url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
  password: process.env.REDIS_PASSWORD,
});

redisClient.connect().catch(console.error);
const pageRouter = require('./routes/page');
const authRouter = require('./routes/auth/auth');
const bookRouter = require('./routes/book/book');
const reviewRouter = require('./routes/book/review');
const memberRouter = require('./routes/members/members');
const wishlistRouter = require('./routes/wishlist/wishlist');
const listRouter = require('./routes/wishlist/list');
const favoriteRouter = require('./routes/favorite/favorite');
const quotesRouter = require('./routes/quotes/quotes');
const openRouter = require('./routes/open/open');

const { sequelize } = require('./models');
const passportConfig = require('./passport');

const app = express();
passportConfig();
// app.set('port', process.env.PORT || 8080);
app.set('view engine', 'html');
nunjucks.configure('views', {
  express: app, 
  watch: true,
});

sequelize.sync({ force: false })
  .then(() => {
    console.log('데이터베이스 연결 성공');
  })
  .catch(err => {
    console.error(err);
  });

if(process.env.NODE_ENV === 'production') {
  app.use(morgan('combined'));
} else {
  app.use(morgan('dev'));
}

app.use(express.static(path.join(__dirname, 'public')));
app.use('/img', express.static(path.join(__dirname, 'uploads')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cooikeParser(process.env.COOKIE_SECRET));
const sessionOption = {
  resave: false,
  saveUninitialized: false,
  secret: process.env.COOKIE_SECRET,
  cookie: {
    expires: new Date(Date.now() + 7200000),
    httpOnly: true,
    secure: false,
  },
  store: new RedisStore({ client: redisClient }),
  name: 'BOOKCLUB',
};
app.use(session(sessionOption));
app.use(passport.initialize());
app.use(passport.session());

app.use('/', pageRouter);
app.use('/auth', authRouter);
app.use('/book', bookRouter);
app.use('/review', reviewRouter);
app.use('/members', memberRouter);
app.use('/wishlist', wishlistRouter);
app.use('/list', listRouter);
app.use('/favorite', favoriteRouter);
app.use('/quotes', quotesRouter);
app.use('/open', openRouter);

app.use((req, res, next) => {
  const error = new Error(`${req.method} ${req.url} 라우터가 없습니다`);
  error.status = 404;
  next(error);
});

app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = process.env.NODE_ENV !== 'production' ? err : {};
  res.status(err.status || 500);
  res.render('error/error');
});

app.listen(app.get('port'), () => {
  console.log(`${app.get('port')}번 포트에서 대기 중`);
});

