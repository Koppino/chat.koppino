const User = require("../models/User");
const path = require('path');

module.exports.getSettings = (req, res) => {
    console.log(req.file)
    res.render('settings/main', {user:req.user});
}

module.exports.change_avatar = (req, res) => {
    User.findOne({_id:req.user._id},(err, me) => {
        if(err) console.log(err);
        me.avatarUrl = `${req.file.path}`
        me.save(()=> {
            res.render('settings/change-avatar', {user:req.user});
        })
    })
}
module.exports.getChange_avatar = (req, res) => {
    res.render('settings/change-avatar',{user:req.user});
}