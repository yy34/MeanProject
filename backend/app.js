const express = require("express");

const app = express();

app.use((req, res, next) => {
  console.log("Express test 1");
  next();
});

app.use((req, res, next) => {
  res.send("Express test 2");
});

module.exports = app;
