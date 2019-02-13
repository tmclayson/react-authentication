const mongoose = require('mongoose');
const Schema = mongoose.Schema; // Schema is use to tell mongoose what fields we are going to have
const bcrypt = require('bcrypt-nodejs');
// Define our model
// Before saving a user, ensure that the email is unique
// By default, mongo does not check the case of a string, so convert everything to lowercase first
const userSchema = new Schema({
  email: {
    type: String,
    unique: true,
    lowercase: true,
  },
  password: String,
});

// on save hook, encrypt password
// before saving a model, run this function
userSchema.pre('save', function(next) {
  // need to set context to get access to the user model.
  const user = this;
  // generate a salt (which takes some amount of time), then run cb
  // a salt is a randomly generated string of characters
  bcrypt.genSalt(10, (err, salt) => {
    if (err) {
      console.log(err);
      return next(err);
    }
    // hash (encrypt) our password using the salt
    bcrypt.hash(user.password, salt, null, (err, hash) => {
      if (err) {
        console.log(err);
        return next(err);
      }
      // overwrite plain text password with encrpyted password
      // the encrypted password contains the salt and the password
      user.password = hash;
      next();
    });
  });
});

userSchema.methods.comparePassword = function(candidatePassword, callback) {
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
    if (err) {
      return callback(err);
    }
    // the result from bcrypt.compare is saved in isMatch
    callback(null, isMatch);
  });
};

// Create the model class
const ModelClass = mongoose.model('user', userSchema);
// Export
module.exports = ModelClass;
