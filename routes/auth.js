const express = require('express');
const passport = require('passport');
const bcrypt = require('bcrypt');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');
const Member = require('../models/member');

const router = express.Router();

router.post('/signup', isNotLoggedIn, async (req, res) => {
  console.log('2. 회원가입 라우터 진입');
  const { email, nick, password } = req.body;
  console.log('3. 로그인 폼:', email, nick, password);
  try {
    const exUser = await Member.findOne({ where: { email }});
    if(exUser) {
      console.log('exUser존재', exUser);
    }
    const hash = await bcrypt.hash(password, 12);
    await Member.create({
      email,
      nick,
      password: hash,
    });
    console.log('4. 회원가입이 완료되었습니다 alert창 띄우기');
    res.locals.joined = true;
    return res.redirect('/');  
  } catch (error) {
    console.log('회원가입 오류', error);
    return next(error);
  }
});

router.post('/login', isNotLoggedIn, async (req, res, next) => {
  console.log('2 로그인 라우터 입성', "passport.authenticate('local'..작동", 'req객체의 이메일과 비번',  req.body.email, req.body.password);
  passport.authenticate('local', (authError, user, info) => {
    if(authError) {
      console.error('authError', authError);
      return next(authError);
    }
    if(!user) {
      console.log('로그인 실패');
      return res.redirect('/'); // redirect는 라우터
    }
    return req.login(user, (loginError) => {
      console.log('8 req.login 호출,', user);
      if(loginError) {
        console.error('loginError', loginError);
        return next(loginError);
      }
      return res.redirect('/');
    });
  })(req, res, next);
});

router.route('/logout')
  .post(isLoggedIn, (req, res, next) => {
    // req.logout((err) => {
    // if (err) { return next(err); }
    // console.log('여기1', req.body.answer);
    // console.log('로그아웃 완료?', req.user);
    // res.locals.user = null;
    // console.log(req.user, res.locals.user); // null
    // req.session.destroy();
    // console.log('세션 디스트로이,', req.session, req.sessionID);
    // return res.json({ dd: 'dd' });
    // });
    if(req.body.answer) {
      console.log('여기1', req.body.answer);
      req.user = null;
      console.log('로그아웃 완료?', req.user);
      console.log(req.user, res.locals.user); // null
      req.session.destroy();
      console.log('세션 디스트로이,', req.session, req.sessionID);
}});



module.exports = router;