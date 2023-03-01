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
    image: {
      type: String,
      required: [true, 'Image is required.']
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
    following: {
      type: [Schema.Types.ObjectId],
      ref: 'User'
    },
    followers: {
      type: [Schema.Types.ObjectId],
      ref: 'User'
    }
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`    
    timestamps: true
  }
);

const User = model("User", userSchema);

module.exports = User;
