const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const userRouter  = express.Router();

userRouter.post('/api/signup', (req, res, next) =>{
  const username = req.body.username;
  const password = req.body.password;
  const email = req.body.email;
  const language = req.body.language;

  if (!username || !password) {
    res.status(400).json({message: 'Provide Username and Password'});
    return;
  }

    User.findOne({username: username}, '_id', (err, foundUser) => {
  if (foundUser) {
    res.status(400).json({message: 'This username already exists'});
    return;
  }

    const salt = bcrypt.genSaltSync(10);
    const hashPass = bcrypt.hashSync(password, salt);

    const theUser = new User ({
      username: username,
      password: hashPass,
      email: email,
      language: language
    });
    theUser.save((err) =>{
      if (err){
        res.status(500).json({message: "Something went wrong with saving"});
        return;
      }
      req.login(theUser, (err) =>{
        if (err){
          res.status(500).json({message: "Something went wrong with login"});
          return;
        }
        theUser.password = undefined;
        res.status(200).json({theUser});
      });
    });
  });
});

userRouter.post('/api/login', (req, res, next) =>{
  const username = req.body.email;
  const password = req.body.password;
  console.log('Username = ', req.body);

  User.findOne({email: username}, (err, foundUser) => {
    console.log("USER NAME FROM DB = ", foundUser);
    if (!foundUser) {
        res.status(400).json({message: "Incorrect Username"});
        return;
    }
    if (!bcrypt.compareSync(password, foundUser.password)){
      res.status(400).json({message: "Incorrect password"});
      return;
    }
    req.login(foundUser, (err) => {
      if (err){
        res.status(500).json({message: "Something went wrong login"});
      }
      foundUser.password = undefined;
      res.status(200).json(foundUser);
    });
  });
});

userRouter.post('/api/logout', (req, res, next) => {
  req.logout();
  res.status(200).json({ message: 'Success' });
});

userRouter.get('/api/checklogin', (req, res, next) => {
  if (req.isAuthenticated()) {
    res.status(200).json(req.user);
    return;
  }

  res.status(403).json({ message: 'Unauthorized' });
});
userRouter.get('/api/private', (req, res, next) => {
  if (req.isAuthenticated()) {
    res.json({ message: 'This is a private message' });
    return;
  }

  res.status(403).json({ message: 'Unauthorized' });
});



module.exports = userRouter;
