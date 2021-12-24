const Like = require('../models/Like');
const Post = require('../models/Post')

module.exports.addPost = async (req, res) => {
  let type = 1;
  let filesUrlArray = [];
  for (let i = 0; i < req.files.files.length; i++) {
    const element = req.files.files[i];
    filesUrlArray.push(element.filename);

    if (
      element.mimetype.split("/")[1] == "mov" ||
      element.mimetype.split("/")[1] == "avi" ||
      element.mimetype.split("/")[1] == "mp4" ||
      element.mimetype.split("/")[1] == "quicktime"
    ) {
      type = 2;
    }
  }

  const newPost = await new Post({
    sender: req.user,
    senderName: req.user.username,
    title: req.body.title,
    body: req.body.message,
    type: type,
    filesUrl: filesUrlArray,
    views: 0,
    mainFotoUrl: req.files.img[0].filename,
  });
  await newPost.save(() => {
    res.redirect("/settings");
  });
  console.log(filesUrlArray);
};

module.exports.getAddPost = (req, res) => {
  res.render("settings/add-post", { user: req.user });
};


module.exports.getPost = (req, res) => {
    const  postId = req.params.postId
    Post.findOne({_id:postId}, (err, post) => {
        if(err) console.log(err);
        if(!post) { console.log('no post')}
        res.render('posts/post', {user:req.user, post:post, views: post.views})
    })
}

module.exports.addLike = (req, res) => {
  const postId = req.params.postId;
  Post.findOne({_id:postId}, (err, post) => {
    if(err) console.log(err);

    Like.findOne({sender:req.user._id, post:post}, (err,like) => {
      if(like) { console.log('already liked')
      res.redirect('/dashboard')}
      else {
        const newLike = new Like({
          sender:req.user._id,
          senderName:req.user.username,
          post:post
        })

        newLike.save(() => {
          post.likes.push(newLike)
          post.save(()=> { console.log('done.')
        res.redirect('/dashboard')})
        })
      }
    })

  })
}