const passport = require('passport');
const local = require('./localStrategy');
const Member = require('../models/member');

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
}