const Comment = require("../models/Comment");
const Post = require("../models/Post");

module.exports.postComment = (req,res) => {
    const postId = req.params.postId; 
    console.log(req.body);
    Post.findOne({_id:postId}, (err, post) => {
        if(err) console.log(err);
        const newComment = new Comment({
            sender:req.user._id,
            senderName:req.user.username,
            comment:req.body.comment,
            post:post
        })
        newComment.save(()=> {
const array = {senderName:req.user.username,sender:req.user._id,comment:req.body.comment,createdAt:Date.now()}
post.komentare.push(array)
            post.comments.push(newComment);
            post.save(() => {
                res.redirect('/dashboard')
            });
        })
    })
}