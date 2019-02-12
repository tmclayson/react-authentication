const User = require('../models/user');

exports.signup = (req, res, next) => {
  const { email, password } = req.body;
  // res.send(req.body);
  // see if a user with a given email exists
  // if they do, then existingUser will be populated with their data
  User.findOne({ email: email }, (err, existingUser) => {});
  // if a user with email does exist, return an error

  // if a user with email does NOT exist, create and save use record

  // respond to request indicating the user created.
};
