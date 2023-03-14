const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/user");

router.post("/signup", (req, res, next) => {
  bcrypt.hash(req.body.pass, 10).then((hash) => {
    const newUser = new User({
      email: req.body.mail,
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
});

module.exports = router;
