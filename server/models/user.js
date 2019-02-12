const mongoose = require('mongoose');
const Schema = mongoose.Schema; // Schema is use to tell mongoose what fields we are going to have

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
// Create the model class
const ModelClass = mongoose.model('user', userSchema);
// Export
module.exports = ModelClass;
