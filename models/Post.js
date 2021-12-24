const mongoose = require('mongoose')

const PostSchema = mongoose.Schema({
    sender:{type:mongoose.Schema.Types.ObjectId, ref:'User'},
    senderName:{type:String},
    title:{type:String},
    body:{type:String},
    type:{type:Number},
    filesUrl:[{type:String}],
    videoUrl:{type:String},
    mainFotoUrl:{type:String},
    comments:[{type:mongoose.Types.ObjectId, ref:'Comment'}],
    komentare:[{
        comment:String,
        senderName:String,
        sender:String,
        createdAt:Date
    }],
    likes:[{type:mongoose.Schema.Types.ObjectId, ref:'Like'}],
    views:{type:Number}
}, {timestamps:true})

const Post = mongoose.model('Post', PostSchema);

module.exports = Post