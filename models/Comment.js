const mongoose = require('mongoose');

const CommentSchema = mongoose.Schema({
    sender:{type:mongoose.Schema.Types.ObjectId, ref:'Comment'},
    senderName:{type:String},
    comment:{type:String},
    post:{type:mongoose.Schema.Types.ObjectId, ref:'Post'},
}, {timestamps:true})

const Comment = mongoose.model('Comment', CommentSchema);

module.exports = Comment