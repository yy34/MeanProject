const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const saltRounds = 10;

exports.userCreate = (req, res, next) => {
  bcrypt.hash(req.body.password, saltRounds).then((hash) => {
    const newUser = new User({
      email: req.body.email,
      password: hash,
    });
    newUser
      .save()
      .then((result) => {
        res.status(201).json({
          message: "User successfully created...",
          result: result,
        });
      })
      .catch((err) => {
        res.status(500).json({
          error: err,
        });
      });
  });
};

exports.userLogin = (req, res, next) => {
  let newUser;
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (!user) {
        return res.status(401).json({
          message: "The email and password your provided are invalid...",
        });
      }
      newUser = user;
      return bcrypt.compare(req.body.password, user.password);
    })
    .then((result) => {
      if (!result) {
        return res.status(401).json({
          message: "The email and password your provided are invalid...",
        });
      }
      const token = jwt.sign(
        { email: newUser.email, userId: newUser._id },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );
      res.status(200).json({
        token: token,
        expiresIn: 3600,
        userId: newUser._id,
      });
    })
    .catch((err) => {
      return res.status(401).json({
        message: "The email and password your provided are invalid...",
      });
    });
};
