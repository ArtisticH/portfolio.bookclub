const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

const Member = require('../models/member');

module.exports = () => {
  passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
  }, async (email, password, done) => {
    console.log('3 new LocalStrategy입성', '인수인 이메일과 패스워드', email, password);
    try {
      const exUser = await Member.findOne({ where: { email }});
      console.log('4, exUser유저 있음', exUser);
      if(exUser) {
        const result = await bcrypt.compare(password, exUser.password);
        console.log('5, 비번 일치 결과', result);
        if(result) {
          console.log('6, 로그인 정보 일치, done(null, exUser)');
          done(null, exUser);
        } else {
          done(null, false, { message: '비밀번호가 일치하지 않습니다' });
        }
      } else {
        done(null, false, { message: '가입되지 않은 회원입니다' });
      }
    } catch (error) {
      console.error('new LocalStrategy 오류', error);
      done(error);
    }
  }));
}