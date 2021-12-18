const User = require("../models/User");
const keys = require('./keys')

module.exports = {
    ensureAuthenticated: function(req, res, next) {
        if (req.isAuthenticated()) {
            console.log(
                new Date().toLocaleString("cs-EN").replace(" ", "").replace(" ", "") + " : " + req.user.username
              );
                User.findOne({_id: req.user._id}, (err, me) => {
                    if(err) console.log(err);
                    me.lastActivity =new Date(Date.now()).toLocaleString("cs-CZ").replace(" ", "").replace(" ", "")
                    me.save(() => {console.log('activity saved.') })
                    req.username = me.username
                })
            return next();
        }

        res.redirect('/login');
    },
    forwardAuthenticated: function(req, res, next) {
        if (!req.isAuthenticated()) {
            return next();
        }
        res.redirect('/dashboard')
    }
};