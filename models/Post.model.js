const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the User model to whatever makes sense in this case
const postSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Please add a title"],            
    },
    description: {
      type: String,      
    },
    type: {
      type: String,
      enum: ["image", "video"]
    },
    content: {
      type: String,
      default: ""
    },
    section: {
      type: String,
      enum: ["meme", "lifestyle", "educational", "gaming", "food", "business"]
    },
    comments: {
      type: [Schema.Types.ObjectId],
      ref: 'Comment'
    },
    likes: {
      type: Number,
      default: 0
    },
    dislikes: {
      type: Number,
      default: 0
    },
    createdBy:{
      type: [Schema.Types.ObjectId],
      ref: 'User'
    }
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`    
    timestamps: true
  }
);

const Post = model("Post", postSchema);

module.exports = Post;
