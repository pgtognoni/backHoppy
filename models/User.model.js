const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the User model to whatever makes sense in this case
const userSchema = new Schema(
  {
    username: {
      type: String,
      required: [true, "Please add a username"],
      unique: [true, "That username is already taken"],
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required.']
    },
    bio: {
      type: String,
    },
    image: {
      type: [String],    
      default: ["https://i.pinimg.com/564x/e7/77/ab/e777ab47741cf8e66f80b5711782f98e.jpg", "https://moon.ly/uploads/nft/61b9d74b817a5c58561cfc24.jpg"]
    },
    commented: {
      type: [Schema.Types.ObjectId],
      ref: 'Post'
    },
    liked: {
      type: [Schema.Types.ObjectId],
      ref: 'Post'
    },
    disliked: {
      type: [Schema.Types.ObjectId],
      ref: 'Post'
    },
    published: {
      type: [Schema.Types.ObjectId],
      ref: 'Post'
    },
    groups: {
      type: [Schema.Types.ObjectId],
      ref: 'Group'
    },
    following: {
      type: [Schema.Types.ObjectId],
      ref: 'User'
    },
    followers: {
      type: [Schema.Types.ObjectId],
      ref: 'User'
    },
    currency: {
      type: Number,
      default: 0,
      min: 0
    }
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`    
    timestamps: true
  }
);

const User = model("User", userSchema);

module.exports = User;
