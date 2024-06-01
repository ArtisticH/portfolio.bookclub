const express = require('express');
const passport = require('passport');
const bcrypt = require('bcrypt');
const { Member } = require('../../models/main');

const router = express.Router();

router.post('/signup', async (req, res) => {
  const { email, nick, password } = req.body;
  try {
    if(!email || !nick || !password) {
      return res.redirect('/?signup=blank');
    }
    const exUser = await Member.findOne({ where: { email }});
    if(exUser) {
      return res.redirect('/?signup=exist');
    }
    const hash = await bcrypt.hash(password, 12);
    await Member.create({
      email,
      nick,
      password: hash,
    });
    return res.redirect('/?signup=success');
  } catch (error) {
    return next(error);
  }
});

router.post('/login', async (req, res, next) => {
  const { email, password } = req.body;
  if(!email || !password) {
    return res.redirect('/?login=blank');
  }
  passport.authenticate('local', (authError, user, info) => {
    if(authError) {
      return next(authError);
    }
    if(!user) {
      return res.redirect(`/?login=${info.message}`); 
    }
    return req.login(user, (loginError) => {
      if(loginError) {
        return next(loginError);
      }
      return res.redirect('/?login=success');
    });
  })(req, res, next);
});

router.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) { return next(err); }
    req.session.destroy();
    return res.redirect('/?logout=success');
  });
});

router.get('/kakao',  passport.authenticate('kakao'));
router.get('/kakao/callback', passport.authenticate('kakao', {
  failureRedirect: '/',
}), (req, res) => {
  res.redirect('/');
});

router.get('/naver',  passport.authenticate('naver', { authType: 'reprompt' }));
router.get('/naver/callback', passport.authenticate('naver', {
  failureRedirect: '/',
}), (req, res) => {
  res.redirect('/');
});

module.exports = router;