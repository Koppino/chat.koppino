const fetch = require("node-fetch");

module.exports.getDashboard = (req, res) => {
    res.render("dashboard", { user: req.user, username: req.user.username });
};
module.exports.getHomepage = (req, res) => {
  res.render("homepage", { user: req.user });
};
