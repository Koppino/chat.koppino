const fetch = require("node-fetch");
const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const session = require("express-session");
const passport = require("passport");
const morgan = require("morgan");
const mongoose = require("mongoose");
const { mongoURI } = require("./config/keys");
const app = express();
const path = require("path");
const flash = require("connect-flash");
const { request } = require("express");
const http = require("http").Server(app);
const io = require("socket.io")(http);
const locals = require("./config/locals");
const Post = require("./models/Post");
require("./config/passport")(passport);
db = mongoURI;
mongoose
  .connect(db, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));
app.use(expressLayouts);

app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use(flash());

app.use(
  session({ secret: "keyboard cat", resave: false, saveUninitialized: false })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(morgan("dev"));

app.locals.formatTime = locals.formatDate;
app.use("/", require("./routes/index"));
app.use("/users", require("./routes/users"));
app.use("/chat", require("./routes/chat"));
app.use("/settings", require("./routes/settings"));
app.use("/posts", require("./routes/posts"));
app.use("/api", require("./routes/api"));
let chusers = [];
let userswithnick = [];

io.on("connection", (client) => {
  chusers.push(client.id);
  console.log(
    "- User " +
      client.id +
      " connected (" +
      client.handshake.address +
      "). Total users: " +
      chusers.length
  );
  client.emit("connect-client", chusers);

  client.emit("chat-users", { chusers: chusers });

  client.on("nickname", (nick) => {
    var arr = { nick: nick, id: client.id };
    userswithnick.push(arr);

    io.sockets.emit("chat-users", userswithnick);
  });

  client.on("disconnect", function () {
    var length = chusers.length;
    for (var i = 0; i < length; i++) {
      if (chusers[i] === client.id) {
        chusers.splice(i, 1);
        break;
      }
    }
    var lengthA = userswithnick.length;
    for (var i = 0; i < lengthA; i++) {
      if (userswithnick[i].id === client.id) {
        userswithnick.splice(i, 1);
        break;
      }
    }

    console.log(
      "- User " +
        client.id +
        " disconnected (" +
        client.handshake.address +
        "). Total users: " +
        chusers.length
    );
  });
  client.on("new message", (data) => {
    console.log(data);
    io.emit("new message", data);
  });
  client.on("new img msg", (data) => {
    console.log(data);
    io.emit("new img msg", data);
  });
  client.on("chat delete", (data) => {
    console.log(data + "picus");
    io.emit("chat delete", data);
  });
  client.on('add view stats', (data) => {
    Post.findOne({_id: data.postId}, (err, pst) => {
      if(err) console.log(err);
        pst.views++;
         pst.save(()=> { console.log('done.')})
      })
     
    })
  })

http.listen("1337", () => {
 
  console.log("server is running.");
});
