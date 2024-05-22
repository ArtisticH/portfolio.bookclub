const passport = require('passport');
const KakaoStrategy = require('passport-kakao').Strategy;

const { Member } = require('../models/main');

module.exports = () => {
  passport.use(new KakaoStrategy({
    clientID: process.env.KAKAO_ID,
    callbackURL: '/auth/kakao/callback',
  }, async(acessToken, refreshToken, profile, done) => {
    console.log('kakao profile', profile,
    acessToken, refreshToken);
    try {
      const exUser = await Member.findOne({
        where: { 
          snsId: profile.id,
          provider: 'kakao',
        },
      });
      if(exUser) {
        done(null, exUser);
      } else {
        const newUser = await Member.create({
          email: profile._json && profile._json.kakao_account_email,
          nick: profile.displayName,
          snsId: profile.id,
          provider: 'kakao',
        });
        done(null, newUser);
      }
    } catch(error) {
      done(error);
    }
  }));
}