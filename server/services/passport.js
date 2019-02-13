const passport = require('passport');
const User = require('../models/user');
const config = require('../config');
// strategies are plugins for passport that attempt to authenticate a user in a
// particular fashion
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const LocalStrategy = require('passport-local');

// create local strategy
// we the local strategy for the authentication flow of:
// signing in -> verify email/password -> recieve token
// the jwt strategy is for the flow of:
// authenticated request -> verify token -> resource access
// we have to tell passport that we will be using an email instead of username
const localLogin = new LocalStrategy(
  { usernameField: 'email' },
  (email, password, done) => {
    // verify email and password, call done with user if it is correct
    User.findOne({ email: email }, (err, user) => {
      if (err) {
        return done(err);
      }
      if (!user) {
        // no err, but user can't be found
        return done(null, false);
      }
      // user found, so now compare passwords
      // we hash the submitted password with the salt, and then compare this to
      // the saved hashed password
      user.comparePassword(password, function(err, isMatch) {
        if (err) {
          return done(err);
        }
        if (!isMatch) {
          return done(null, false);
        }
        // if they match then return no error and the user
        return done(null, user);
      });
    });
    // otherwise call false
  }
);

// setup options for JWT Strategy
const jwtOptions = {
  // the token could be in several places (e.g. body, header)
  // jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('JWT'),
  // capitalization seems to matter here, though it shouldn't
  jwtFromRequest: ExtractJwt.fromHeader('authorization'),
  secretOrKey: config.secret,
};
// create JTW strategy
// payload is the decoded jwt token
// done is the callback function, that we need to call depending on whether
// authentication was successful or not
const jwtLogin = new JwtStrategy(jwtOptions, function(payload, done) {
  // see if user ID in payload exists in our database
  User.findById(payload.sub, function(err, user) {
    if (err) {
      console.log(err);
      return done(err, false);
    }
    // pass null since there is no error
    if (user) {
      done(null, user);
    } else {
      console.log(`user doesn't exist`);
      // the user doesn't exist, so can't be authenticated. return false.
      done(null, false);
    }
  });
  // if it does, call 'done' with that user

  // otherwise, call done without a user object
});

passport.use(jwtLogin);
passport.use(localLogin);
