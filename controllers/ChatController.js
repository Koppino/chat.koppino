const User = require("../models/User");
const ChatRoom = require("../models/ChatRoom");
const ChatMessage = require("../models/ChatMessage");
const { resolveMx } = require("dns");
const app = require("express")();
const http = require("http").Server(app);
const io = require("socket.io")(http);


module.exports.getChatR = async (req, res) => {
  const friendId = req.params.friendId;
  let finalRoom;
  const ids = `${req.user._id},${friendId}`;
  let room = await ChatRoom.findOne({users : ids.split(',')}).exec();
  if (room === null) {
    const ids = `${friendId},${req.user._id}`;
    let roomTwo = await ChatRoom.findOne({users: ids.split(',')}).exec();
    finalRoom = roomTwo;
    console.log("Try n.2" + roomTwo)
    return finalRoom;
  } else {
    console.log("Try n.1" + room)
    finalRoom = room;
    return finalRoom;
  }

}

module.exports.getChatRoom = (req, res) => {
  const roomId = req.params.roomId;
  let room;
  User.find({}, (err, users) => {
    if(err) console.log(err)
    ChatRoom.find(
    { users: req.user._id },
    null,
    { sort: { updatedAt: -1 } },
    (err, chatRooms) => {
      if (err) return console.log(err);

      User.findOne({ _id: req.user._id }, (err, me) => {
        if (err) return console.log(err);

        User.findOne({ _id: roomId }, (err, chatUser) => {
          if (err) return console.log(err);

          ChatRoom.findOne(
            { users: [me, chatUser] },
            null,
            { sort: { updatedAt: -1 } },
            async (err, chatRoom) => {
              if (err) return console.log(err);
              if (!chatRoom) {
                ChatRoom.findOne(
                  { users: [chatUser, me] },
                  null,
                  { sort: { updatedAt: -1 } },
                  (err, chatRoom2) => {
                    if (err) return console.log(err);
                    if (!chatRoom2) {
                      const newRoom = new ChatRoom({
                        users: [me, chatUser],
                        usernames: [me.username, chatUser.username],
                        lastMessage: null,
                        messages: [],
                      });

                      newRoom.save(async (err) => {
                        if (err) return console.log(err);
                        chatUser.chatRooms.push(newRoom);
                        await chatUser.save();
                        me.chatRooms.push(newRoom);
                        await me.save();
                        res.render("chat/chat", {
                          user: req.user,
                          chatRooms: chatRooms,
                          chatRoom: newRoom,
                          chatMessages: [],
                          users:users
                        });
                      });
                    } else {
                      if (chatRoom2.unreadMessage == req.user._id) {
                        chatRoom2.unreadMessage = "";
                        chatRoom2.save();
                      }
                      ChatMessage.find(
                        { room: chatRoom2._id },
                        null,
                        { sort: { updatedAt: 1 } },
                        (err, messages) => {
                          if (err) console.log(err);
                          res.render("chat/chat", {
                            user: req.user,
                            chatRooms: chatRooms,
                            chatRoom: chatRoom2,
                            chatMessages: messages,
                            users:users
                          });
                        }
                      );
                    }
                  }
                );
              } else {
                if (chatRoom.unreadMessage == req.user._id) {
                  chatRoom.unreadMessage = "";
                  chatRoom.save();
                }
                await ChatMessage.find(
                  { room: chatRoom._id },
                  null,
                  { sort: { updatedAt: 1 } },
                  (err, messages) => {
                    if (err) console.log(err);

                    res.render("chat/chat", {
                      user: req.user,
                      chatRoom: chatRoom,
                      chatRooms: chatRooms,
                      chatMessages: messages,
                      users:users
                    });
                  }
                );
              }
            }
          );
        });
      });
    }
  );
  })
  
};

module.exports.getChatView = (req, res) => {
   User.find({}, (err, users) => {
     if(err) console.log(err);
      ChatRoom.find(
    { users: req.user },
    null,
    { sort: { updatedAt: -1 } },
    (err, rooms) => {
      if (err) return console.log(err);
      res.render("chat/chat", {
        user: req.user,
        chatRooms: rooms,
        chatRoom: null,
        chatMessages: [],
        users:users
      });
    }
  );
   })
 
};

module.exports.postMessage = (req, res) => {
  const roomId = req.params.roomId;
  const message = req.body.message;
  const reciver = req.body.reciver;
  ChatRoom.findOne({ _id: roomId }, (err, chatroom) => {
    if (err) console.log(err);
    if (chatroom) {
      const newMessage = new ChatMessage({
        sender: req.user,
        senderName: req.user.username,
        message: message,
        room: chatroom,
      });
      newMessage.save((err, msg) => {
        if (err) console.log(err);
        io.sockets.emit("new msg", newMessage);
        chatroom.messages.push(newMessage);
        chatroom.lastMessage = newMessage.message;
        chatroom.lastMessasgeTime = new Date(Date.now());
        chatroom.unreadMessage = reciver;
        chatroom.save(() => {
          res.redirect(`/chat/${reciver}`);
        });
      });
    }
  });
};

module.exports.removeChatMessages = (req, res) => {
  const id = req.params.id;
  ChatMessage.deleteMany({ room: id }, (err, _) => {
    if (err) console.log(err);

    ChatRoom.findOne({ _id: id }, (err, room) => {
      if (err) {
        console.log(err);
      }
      const newMessage = new ChatMessage({
        sender: req.user,
        senderName: req.user.username,
        message: "chat conversation was removed.",
        room: room,
      });
      newMessage.save((err, msg) => {
        if (err) console.log(err);
        room.messages = [msg];
        room.lastMessage = "chat conversation was removed.";
        room.lastMessasgeTime = new Date(Date.now());
        room.save((err, room) => {
          if (err) console.log(err);
          if (room.usernames[0] == req.user.username) {
            res.redirect(`/chat/${room.users[1]}`);
          } else {
            res.redirect(`/chat/${room.users[0]}`);
          }
        });
      });
    });
  });
};

module.exports.sendImage = (req, res) => {
  const id = req.params.id;
  console.log(req.body);
  console.log(req.file);
  ChatRoom.findOne({ _id: id }, (err, chatroom) => {
    if (err) console.log(err);

    const newMsg = new ChatMessage({
      imgUrl: req.file.path,
      msgType: "img",
      room: chatroom,
      message: "poslal obrázek.",
      senderName: req.user.username,
      sender: req.user,
    });
    newMsg.save(() => {
      let chatuserid;
      if (chatroom.usernames[0] == req.user.username) {
        chatuserid = chatroom.users[1];
      } else {
        chatuserid = chatroom.users[0];
      }
      console.log(newMsg);
      io.sockets.emit("new img msg", newMsg);
      chatroom.messages.push(newMsg);
      chatroom.lastMessage = newMsg.message;
      chatroom.lastMessasgeTime = new Date(Date.now());
      chatroom.unreadMessage = chatuserid;
      chatroom.save(() => {
        res.redirect(`/chat/${chatuserid}`);
      });
    });
  });
};

module.exports.getNewMessage = (req, res) => {
  User.find({}, (err, users) => {
    if (err) {
      console.log(err);
    }
    res.render("chat/new-message", { user: req.user, users: users });
  });
};
