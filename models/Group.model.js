const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the User model to whatever makes sense in this case
function arrayLimit(val) {
    return val.length <= 5;
  }

const groupSchema = new Schema(
  {
    name: {
      type: String,
      // required: [true, "Please add a Name"],
      unique: [true, "That Name is already taken"],
      trim: true,
    },
    createdBy:{
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    createdByImg: {
        type: String,      
    },
    createdByName: {
        type: String,      
    },
    description: {
        type: String,      
    },
    image: {
      type: String,    
    },
    comments: {
        type: [Schema.Types.ObjectId],
        ref: 'Comment'
    },
    likes: {
        type: Number,
        default: 0,
        min: 0
    },
    posts: {
        type: [Schema.Types.ObjectId],
        ref: 'Post'
    },
    members: {
        type: [Schema.Types.ObjectId],
        ref: 'User'
    },
    section: {
        type: String,
        enum: ["meme", "lifestyle", "education", "gaming", "food", "business"]
    },
    tags: {
        type: [String],
        validate: [arrayLimit, '{PATH} exceeds the limit of 5']    
    },
    },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`    
    timestamps: true
  }
);

const Group = model("Group", groupSchema);

module.exports = Group;
