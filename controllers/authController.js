const User = require('../models/User');
const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');


exports.signup = (req, res) => {
  console.log('req.body', req.body); // { "name": "Arturo Filio", "email": "test@test.com", "password":"test123" }
  const user = new User(req.body);
  user.save((error, user) => {
    console.log("reached signup endpoint")
    if (error) {
      return res.status(400).json({
        error: "Please check fields, there was an Error"
      })
    }
    user.salt = undefined;
    user.hashed_password = undefined;
    res.json({
      user
    })
  })
}


exports.signin = (req, res) => { 
  // find the user based on email
  const {email, password} = req.body
  User.findOne({email}, (error, user) => {
    if (error||!user) {
      return res.status(400).json({
        error: 'User with that email does not exist'
      });
    }
    // if user is found make sure the email and password match
    // create authenticate method in user model
    if (!user.authenticate(password)) {
      return res.status(401).json({
        error: 'Email and password don\'t match'
      });
    }
    const token = jwt.sign({_id:user._id}, process.env.JWT_SECRET)
    // persist the token as 't' in cookie with expiration date
    res.cookie('t', token, {expire: new Date() + 9999})
    // return response with user and token to frontend client
    const {_id, name, email, role} = user
    return res.json({token, user: {_id, email, name, role}})
  });
}

exports.signout = (req, res) => { 
  res.clearCookie('t')
  res.json({message: "Signout success"});
};

exports.userById = (req, res, next, id) => {
  User.findById(id).exec((err,user) => {
    if(err||!user) {
      return res.status(400).json({
        error: "User not found"
      });
    }
    req.profile = user;
    next()
  });
}

// exports.isAdmin = (req, res, next) => {
//   let user = req.profile && req.auth && req.profile._id == req.auth._id
//     if(!user) {
//       return res.status(403).json({
//         error: 'Access denied'
//       });
//     }
//   next();
// }

// sing in / login