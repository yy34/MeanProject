const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const postsRoutes = require("./routes/posts");
const userRoutes = require("./routes/user");

const app = express();

mongoose
  .connect(
    "mongodb+srv://yy3474:" +
      process.env.MongoDB_PW +
      "@cluster0.wnuno3b.mongodb.net/angular-db"
  )
  .then(() => {
    console.log("MongoDB connection succeeded...");
  })
  .catch(() => {
    console.log("MongoDB connection failed...");
  });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false })); //* optional

//* cors policy
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, DELETE, OPTIONS"
  );
  next();
});
app.use("/api/posts", postsRoutes);
app.use("/api/user", userRoutes);

module.exports = app;
