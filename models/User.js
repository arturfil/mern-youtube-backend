const mongoose = require('mongoose');
const crypto = require('crypto');
const uuidv1 = require('uuid/v1');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    maxlength: 32
  },
  email: {
    type: String,
    trim: true,
    require: true,
    unique: true
  },
  hashed_password: { 
    type: String,
    required: true,
  },
  salt: String,
  role: {
    type: Number,
    default: 0
  },
  inventory: {
    type: Array,
    default: []
  }
},
{timestamps: true}
);

// virtual field for password hash
userSchema.virtual('password')
.set(function(password) {
  this._password = password;
  this.salt = uuidv1();
  this.hashed_password = this.encryptPassword(password);
})
.get(function() {
  return this._password;
});

userSchema.methods = {
  authenticate: function(plainText) {
    return this.encryptPassword(plainText) === this.hashed_password;
  },

  encryptPassword: function(password) {
    if(!password) return '';
    try {
      return crypto.createHmac('sha1',this.salt)
      .update(password)
      .digest('hex')
    } catch (err) {
      return "";
    }
  }
};

module.exports = mongoose.model('User', userSchema);