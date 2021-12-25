const fetch = require("node-fetch");
const Comment = require("../models/Comment");
const Post = require("../models/Post");

module.exports.getDashboard = (req, res) => {
  Post.find({},null,{sort:{createdAt:-1}},(err, posts) => {
    if(err) console.log(err);
    Comment.find({_id:posts.comments},null,{sort:{createdAt:-1}},(err, comments) => {
      if(err) console.log(err);
      posts.comments = comments;
      res.render('dashboard', {user:req.user,posts:posts,username:req.user.username})
    })
  })
};
module.exports.getHomepage = (req, res) => {
  Post.find({},null,{sort:{createdAt:-1}},(err, posts) => {
    if(err) console.log(err);
    Comment.find({_id:posts.comments},null,{sort:{createdAt:-1}},(err, comments) => {
      if(err) console.log(err);
      posts.comments = comments;
      res.render('homepage', {user:req.user,posts:posts,username:req.user?.username})
    })
  })
};
