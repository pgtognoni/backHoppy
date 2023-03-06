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
      default: ["https://i.pinimg.com/564x/e7/77/ab/e777ab47741cf8e66f80b5711782f98e.jpg", "https://www.cnet.com/a/img/resize/8961558546e1b870a4ca0890be7038d357f2eb62/hub/2021/12/13/d319cda7-1ddd-4855-ac55-9dcd9ce0f6eb/unnamed.png?auto=webp&fit=crop&height=675&width=1200"]
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
