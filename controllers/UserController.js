const Post = require("../models/Post");
const User = require("../models/User")

module.exports.getUsers = (req, res) => {
    User.find({}, null, { sort:{username:1}}, (err, users) => {
        if(err) return console.log(err);
        res.render('users/users', {user:req.user, users:users}) 
    }) 
}

module.exports.getUser = (req, res) => {
    const _id = req.params._id
    User.findOne({_id:_id}, (err, userr) => {
        Post.find({sender:_id},null,{sort:{createdAt:-1}},(err, posts) => {
            if(err)console.log(err);
             if(err) return console.log(err);
        res.render('users/user', {user:req.user, userProfile: userr,posts:posts})
        })
       
    })
}


module.exports.users = (req, res) => {
    User.find({}, (err, users) => {
        console.log(users)
        if(err) console.log(err);
        res.text({users})
    })
}