const Post = require("../models/post");

exports.createPost = (req, res, next) => {
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    creator: req.userData.userId,
  });
  post.save().then((createdPost) => {
    res.status(201).json({
      message: "Post successfully added...",
      postId: createdPost._id,
    });
  });
};

exports.updatePost = (req, res, next) => {
  const post = new Post({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content,
    creator: req.userData.userId,
  });
  Post.updateOne(
    { _id: req.params.id, creator: req.userData.userId },
    post
  ).then((result) => {
    if (result.modifiedCount > 0) {
      res.status(200).json({ message: "Post successfully updated..." });
    } else {
      res.status(401).json({ message: "Not authorized..." });
    }
  });
};

exports.getPosts = (req, res, next) => {
  let displayedData;
  const pageSize = Number(req.query.pagesize);
  const currentPage = Number(req.query.page);
  Post.find()
    .skip(pageSize * (currentPage - 1))
    .limit(pageSize)
    .then((documents) => {
      displayedData = documents;
      return Post.count();
    })
    .then((count) => {
      res.status(200).json({
        message: "Posts successfully fetched...",
        posts: displayedData,
        totalCount: count,
      });
    });
};

exports.getPost = (req, res, next) => {
  Post.findById(req.params.id).then((post) => {
    if (post) {
      res.status(200).json(post);
    } else {
      res.status(404).json({ message: "Post not found..." });
    }
  });
};

exports.deletePost = (req, res, next) => {
  Post.deleteOne({ _id: req.params.id, creator: req.userData.userId }).then(
    (result) => {
      if (result.deletedCount > 0) {
        res.status(200).json({ message: "Post successfully deleted..." });
      } else {
        res.status(401).json({ message: "Not authorized..." });
      }
    }
  );
};
