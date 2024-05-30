const passport = require('passport');
const { Strategy: NaverStrategy, Profile: NaverProfile } = require('passport-naver-v2');

const { Member } = require('../models/main');

module.exports = () => {
  passport.use(
     new NaverStrategy(
        {
           clientID: process.env.NAVER_ID,
           clientSecret: process.env.NAVER_SECRET,
           callbackURL: '/auth/naver/callback',
        },
        async (accessToken, refreshToken, profile, done) => {
           try {
              const exUser = await Member.findOne({
                 where: { snsId: profile.id, provider: 'naver' },
              });
              // 이미 가입된 네이버 프로필이면 성공
              if (exUser) {
                 done(null, exUser);
              } else {
                 // 가입되지 않는 유저면 회원가입 시키고 로그인을 시킨다
                 const newUser = await Member.create({
                    email: profile.email,
                    nick: profile.name,
                    snsId: profile.id,
                    provider: 'naver',
                 });
                 done(null, newUser);
              }
           } catch (error) {
              console.error(error);
              done(error);
           }
        },
     ),
  );
};
