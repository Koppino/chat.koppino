const mongoose = require('mongoose')

const LikeSchema = mongoose.Schema({
    sender:{type:mongoose.Schema.Types.ObjectId, ref:'User'},
    senderName:{type:String},
    post:{type:mongoose.Schema.Types.ObjectId, ref:'Post'}
}, {timestamps:true})

const Like = mongoose.model('Like', LikeSchema);

module.exports = Like