
const User = require("../models/User");
const passport = require("passport");
const bcrypt = require('bcryptjs')

module.exports.doLogin = (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/dashboard",
    failureRedirect: "/login",
    failureFlash: true,
  })(req, res, next);
};

module.exports.doLogout = (req, res) => {
  req.logout();
  res.status(100).redirect("/");
};

module.exports.getLogin = (req, res) => {
  res.render("auth/login", { user: req.user, messsage: req.flash('danger')});
};

module.exports.getRegister = (req, res) => {
  res.render("auth/register", { user: req.user });
};

module.exports.doRegister = async (req, res) => {
  const { username,email, password, password2 } = req.body;
  let errors = [];

  if (!username || !email || !password || !password2) {
    errors.push({ msg: "Please enter all fields" });
    req.flash('danger', 'Vyplntě všechna pole.')
  }

  if (password != password2) {
    req.flash('danger', 'Hesla se neshodují')
    errors.push({ msg: "Passwords do not match" });
  }

  if (password.length <= 4) {
    req.flash('danger', 'Heslo musí být delší než 4 znaky')
    errors.push({ msg: "Password must be at least 4 characters" });
  }

  if (errors.length > 0) {
    res.render("auth/register", {user:req.user,
      errors,
      username,
      password,
      password2,
      message: req.flash('danger')
    });
  } else {
    User.findOne({ username: username }).then((user) => {
      if (user) {
        errors.push({ msg: "Username already exists" });
        req.flash('danger', 'Uživatel již existuje.')
        res.render("auth/register", {
          errors,
          username,
          password,
          password2,
          user: req.user,
          message: req.flash('danger')
        });
      } else {
        let newUid = 1
        User.findOne({}, null, { sort: { createdAt: -1 } }, async(err, data) => {
            if (err) {
              console.log(err);
            } else {
              if (data) {
                 newUid = data.uid +1
              }

              const newUser = new User({
                email:email,
                username: username,
                password: password,
                createdAt: Date.now(),
                admin:false,
                uid: newUid
              });

              if(req.user) {
                newUser.createdBy = req.user
                console.log("created by : " + req.user.username )
              }

              bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(newUser.password, salt, (err, hash) => {
                  if (err) throw err;
                  newUser.password = hash;
                  newUser
                    .save()
                    .then((user) => {
                      res.render("auth/login", {
                        user: req.user,
                        message: req.flash('danger')
                      });
                    })
                    .catch((err) => console.log(err));
                });
              });
            }
          }
        );
      }
    })
  }
};
