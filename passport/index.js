const passport = require('passport');
const local = require('./localStrategy');
const kakao = require('./kakaoStrategy');
const { Member } = require('../models/main');

module.exports = () => {
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    Member.findOne({ where: { id }})
      .then(user => {
        done(null, user);
      })
      .catch(err => done(err));
  });

  local();
  kakao();
}