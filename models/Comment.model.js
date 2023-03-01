const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the User model to whatever makes sense in this case
const commentSchema = new Schema(
  {
    user: {
      type: [Schema.Types.ObjectId],
      ref: 'Post'           
    },
    body: {
      type: String,      
    }
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`    
    timestamps: true
  }
);

const User = model("User", commentSchema);

module.exports = User;
