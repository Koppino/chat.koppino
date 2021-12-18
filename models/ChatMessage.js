const mongoose = require('mongoose')

const ChatMessageSchema = mongoose.Schema({
    sender: {type:mongoose.Schema.Types.ObjectId, ref:'User'},
    senderName:{type:String},
    message:{type:String},
    unread:{type:Boolean, default:true},
    room:{type:mongoose.Schema.Types.ObjectId, ref:'ChatRoom'},
    msgType: {type:String, default:"text"},
    imgUrl:{type:String}
},{timestamps:true})

const ChatMessage = mongoose.model('ChatMessage', ChatMessageSchema);

module.exports = ChatMessage