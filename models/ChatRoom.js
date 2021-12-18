const mongoose = require('mongoose')

const ChatRoomSchema = mongoose.Schema({
    users:[{type:mongoose.Schema.Types.ObjectId, ref: 'User'}],
    usernames:[{type:String}],
    lastMessage:{type:String},
    lastMessageTime:{type:Date},
    messages:[{type:mongoose.Schema.Types.ObjectId, ref:'ChatMessage'}],
    unreadMessage:{type:String}
}, {timestamps:true})

const ChatRoom = mongoose.model('ChatRoom', ChatRoomSchema);

module.exports = ChatRoom