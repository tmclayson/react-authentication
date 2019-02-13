const jwt = require('jwt-simple');
const User = require('../models/user');
const config = require('../config');

function tokenForUser(user) {
  // don't encode a user's email, as this can change over time.
  // the jwt convention has a sub (subject) property
  // iat - issued at time
  const timestamp = new Date().getTime();
  return jwt.encode({ sub: user.id, iat: timestamp }, config.secret);
}

exports.signin = function(req, res, next) {
  // use has already had their email and password auth'd
  // we just need to give them a token
  // the done callback in the localStrategy assigns the user to
  // req.user so we have access here
  res.send({ token: tokenForUser(req.user) });
};

exports.signup = (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    // we should also validate the emai format
    return res
      .status(422)
      .send({ error: 'You must provide an email and password' });
  }
  // res.send(req.body);
  // see if a user with a given email exists
  // if they do, then existingUser will be populated with their data
  User.findOne({ email: email }, (err, existingUser) => {
    if (err) {
      // e.g. if the connection tot he database failed;
      return next(err);
    }
    // if a user with email does exist, return an error
    if (existingUser) {
      // A 422 'Unprocessable Entity' status code occurs when a request is well - formed,
      // however, due to semantic errors it is unable to be processed.
      // In most cases, it is agreed upon that the 422 status should only be returned
      // if you support WebDAV capabilities.
      return res.status(422).send({ error: 'Email is in use.' }); // sets the HTTP code
    }
    const user = new User({
      email: email,
      password: password,
    });

    user.save(err => {
      if (err) {
        console.log(err);
        return next(err);
      }
      // res.json() can format the returned JSON data by applying two options:
      // app.set('json replacer', replacer); // property transformation rules (a function that replaces the values of specified keys)
      // app.set('json spaces', 2); // number of spaces for indentation
      // under the hood, res.json() will call JSON.stringify() before calling res.send()
      // ------------------------------------------
      // we want to send back a json web token (jwt)
      // on signup -> userid + secretString
      // in the future, when the makes an authenticated request -> jwt + secretString (the server has this) = userid
      res.json({ token: tokenForUser(user) });
    });

    // if a user with email does NOT exist, create and save use record
  });

  // respond to request indicating the user created.
};
