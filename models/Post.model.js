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
      enum: ["link", "image", "video"]
    },
    commented: {
      type: [Schema.Types.ObjectId],
      ref: 'Post'
    },
    liked: {
      type: [Schema.Types.ObjectId],
      ref: 'Post'
    },
    published: {
      type: [Schema.Types.ObjectId],
      ref: 'Post'
    },
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`    
    timestamps: true
  }
);

const Post = model("Post", userSchema);

module.exports = Post;
