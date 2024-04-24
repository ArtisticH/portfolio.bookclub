exports.isLoggedIn = (req, res, next) => {
  if(req.isAuthenticated()) {
    next();
  } else {
    res.status(403).send('로그인 필요');
  }
};

exports.isNotLoggedIn = (req, res, next) => {
  if(!req.isAuthenticated()) {
    console.log('1. isNotLoggedIn 로그인 안 한 상태', 'req.isAuthenticated(): false');
    next();
  } else {
    res.status(403).send('로그인한 상태입니다.');
  }
};