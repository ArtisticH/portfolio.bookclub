const passport = require('passport');
const local = require('./localStrategy');
// const kakao = require('./kakaoStrategy');
// const naver = require('./naverStrategy');
const Member = require('../models/member');

module.exports = () => {
  passport.serializeUser((user, done) => {
    console.log('8. serializeUser', user, user.id);
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    console.log('10. deserializeUser', 'id: ', id);
    Member.findOne({ where: { id }})
      .then(user => {
        console.log('11. DB에서 찾은 정보 user');
        done(null, user);
      })
      .catch(err => done(err));
  });

  local();
  // kakao();
}