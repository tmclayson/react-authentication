const Authentication = require('./controllers/authentication');
const passportService = require('./services/passport');
const passport = require('passport');

// by default, passport tries to create a cookie based session when a user is authenticated,
// but since we are using tokens we pass { session: false }
const requireAuth = passport.authenticate('jwt', { session: false });
// we create a middleware to intercept the request before it is handled
// by the route
const requireSignin = passport.authenticate('local', { session: false });
module.exports = function(app) {
  // req contains all the data about the request that was made
  // res represents the response we are going to form up and send back
  // next is mostly for error handling.
  // app.get('/', function(req, res, next) {
  // res.send(['waterbottle', 'phone', 'paper']);
  // });
  app.get('/', requireAuth, (req, res) => {
    res.send({ message: 'Hi there!' });
  });

  app.post('/signin', requireSignin, Authentication.signin);
  app.post('/signup', Authentication.signup);
};
