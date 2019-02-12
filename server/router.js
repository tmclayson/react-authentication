const Authentication = require('./controllers/authentication');
module.exports = function(app) {
  // req contains all the data about the request that was made
  // res represents the response we are going to form up and send back
  // next is mostly for error handling.
  // app.get('/', function(req, res, next) {
  // res.send(['waterbottle', 'phone', 'paper']);
  // });
  app.post('/signup', Authentication.signup);
};
