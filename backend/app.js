const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const Post = require("./models/post");

const app = express();

mongoose
  .connect(
    "mongodb+srv://yy3474:AtBfs3UnFwkcmXJN@cluster0.wnuno3b.mongodb.net/angular-db?retryWrites=true&w=majority"
  )
  .then(() => {
    console.log("MongoDB connection succeeded...");
  })
  .catch(() => {
    console.log("MongoDB connection failed...");
  });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false })); //* optional

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, DELETE, OPTIONS"
  );
  next();
});

app.post("/api/posts", (req, res, next) => {
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
  });
  post.save().then((createdPost) => {
    res.status(201).json({
      message: "Post successfully added...",
      postId: createdPost._id,
    });
  });
});

app.get("/api/posts", (req, res, next) => {
  Post.find().then((documents) => {
    res.status(200).json({
      message: "Posts successfully fetched...",
      posts: documents,
    });
  });
});

app.delete("/api/posts/:id", (req, res, next) => {
  Post.deleteOne({ _id: req.params.id }).then((result) => {
    res.status(200).json({ message: "Post successfully deleted..." });
  });
});

module.exports = app;
